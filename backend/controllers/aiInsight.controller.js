import { GoogleGenAI } from "@google/genai";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const getFinancialInsight = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        // 1. Check Cache
        // If user has an insight, and the insight was generated AFTER the last transaction change
        if (user.lastInsight && user.lastInsightDate && user.lastTransactionChange) {
            if (user.lastInsightDate > user.lastTransactionChange) {
               
                return res.status(200).json({ success: true, insight: user.lastInsight, type: "cached" });
            }
        } else if (user.lastInsight && user.lastInsightDate && !user.lastTransactionChange) {
            // Fallback: If lastTransactionChange is missing (old users), use 1 hour cache or force update
            // Let's assume force update for safety or stick to 1 hour
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (user.lastInsightDate > oneHourAgo) {
                return res.status(200).json({ success: true, insight: user.lastInsight, type: "cached-time" });
            }
        }

        // 2. Fetch Data for Context
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const transactions = await Transaction.find({
            userId,
            date: { $gte: thirtyDaysAgo },
        }).populate("categoryId", "title");

        // 3. Summarize Data for Prompt
        const totalExpenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        // Group expenses by category
        const categoryTotals = {};
        transactions
            .filter((t) => t.type === "expense")
            .forEach((t) => {
                const catName = t.categoryId?.title || "Uncategorized";
                categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
            });

        const topCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name, amount]) => `${name}: ₹${amount}`)
            .join(", ");

        const promptText = `
You are a friendly and practical money buddy.

Here is the user's monthly money summary:
- Income: ₹${totalIncome}
- Expenses: ₹${totalExpenses}
- Net Balance: ₹${totalIncome - totalExpenses}
- Top Categories: ${topCategories || "None"}

Your response MUST follow this EXACT structure with these specific headers:

Financial Health Summary
[Write 2-3 sentences summarizing their situation. Be encouraging. Mention if they are saving well or overspending.]

Spending Analysis
[Bullet point 1: Comment on their biggest expense category.]
[Bullet point 2: Comment on their total spending vs income ratio (e.g. "You spent 40% of your income").]

Actionable Tips
[Tip 1: Practical advice to save money, with a specific number (e.g. "Save ₹500 by...").]
[Tip 2: Another practical tip.]

Rules:
- Use "₹" symbol for money.
- Keep it concise.
- No markdown bolding (**), just plain text under headers.
`;

        console.log("Generating new AI insight...");

        // 4. Call Gemini API
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = 'gemini-3-flash-preview'; // switch to stable model
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
        });
      

        const insightText =
            response?.candidates?.[0]?.content?.parts?.[0]?.text
            || "Unable to generate insight at the moment.";

       

        // 5. Update Cache
        user.lastInsight = insightText;
        user.lastInsightDate = new Date();
        await user.save();

        res.status(200).json({ success: true, insight: insightText, type: "fresh" });

    } catch (error) {
        // console.error("Error generating AI insight:", error);

        
        if (error.status === 429) {
            return res.status(429).json({ success: false, message: "AI service is busy. Please try again later." });
        }

        res.status(500).json({ success: false, message: "Failed to generate insight" });
    }
};
