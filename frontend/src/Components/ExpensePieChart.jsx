import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getTransactions } from '../api/getTransactions';
import { useUser } from '../Context/UserContext';
import Loading from './Loading';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = () => {
    const user = useUser();
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const res = await getTransactions();
                if (res) {
                  const expenses = (res || []).filter(
                    (transaction) => transaction.type === "expense"
                  );
                    
                    // Aggregate expenses by category
                    const categoryTotals = expenses.reduce((acc, curr) => {
                        const categoryName = curr.categoryId?.title || 'Uncategorized';
                        if (!acc[categoryName]) {
                            acc[categoryName] = 0;
                        }
                        acc[categoryName] += curr.amount;
                        return acc;
                    }, {});

                    const labels = Object.keys(categoryTotals);
                    const data = Object.values(categoryTotals);

                    // Premium Theme Colors
                    const backgroundColors = [
                        'rgba(255, 99, 132, 0.8)',   // Rose
                        'rgba(54, 162, 235, 0.8)',   // Blue
                        'rgba(255, 206, 86, 0.8)',   // Yellow
                        'rgba(75, 192, 192, 0.8)',   // Teal
                        'rgba(153, 102, 255, 0.8)',  // Purple
                        'rgba(255, 159, 64, 0.8)',   // Orange
                        'rgba(231, 233, 237, 0.8)',  // Grey
                        'rgba(255, 99, 255, 0.8)'    // Magenta
                    ];

                    const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Expenses by Category',
                                data,
                                backgroundColor: backgroundColors,
                                borderColor: borderColors,
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching transactions for pie chart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);



    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right', // Legend on the right for better layout
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569', // Theme aware text color
                    font: {
                        family: 'Inter, sans-serif',
                        size: 12
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                boxPadding: 4
            }
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loading /></div>;
    
    // Check if there is data
    if (!chartData.labels || chartData.labels.length === 0) {
        return (
             <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-xl transition-colors h-full flex flex-col items-center justify-center min-h-[350px]">
                <h3 className=" text-lg font-bold text-slate-800 dark:text-white ">Expense Breakdown</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No expense data available to display.</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-xl transition-colors h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Expense Breakdown</h3>
            <div className="flex-1 min-h-[300px] relative">
                 <Pie data={chartData} options={{
                     ...options,
                     plugins: {
                         ...options.plugins,
                          legend: {
                             ...options.plugins.legend,
                             labels: {
                                 ...options.plugins.legend.labels,
                                 // Dynamic color needs recalculation or use CSS variable if possible, 
                                 // but simpler to default to a readable medium slate for valid checking.
                                 // Ideally we use a hook or context for theme changes to update chart options dynamically.
                            }
                         }
                     }
                 }} />
            </div>
        </div>
    );
};

export default ExpensePieChart;
