// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import 'dotenv/config'; // Load environment variables from .env


import {
    GoogleGenAI,
} from '@google/genai';

async function main() {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const tools = [
        {
            googleSearch: {
            }
        },
    ];
    const config = {
        thinkingConfig: {
            thinkingLevel: 'HIGH',
        },
        tools,
    };
    const model = 'gemini-3-flash-preview';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `how are you?`,
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    let fileIndex = 0;
    for await (const chunk of response) {
        console.log(chunk.text);
    }
}

main();
