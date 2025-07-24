// src/components/StatsCards.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Clock, CheckCircle } from 'lucide-react';

const StatsCards = ({ stats }) => {
    const statsData = [
        { 
            label: 'Total Orders', 
            value: stats.totalOrders, 
            icon: ShoppingBag, 
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50' 
        },
        { 
            label: 'Total Spent', 
            value: `$${parseInt(Math.ceil(stats.totalSpent))}`, 
            icon: DollarSign, 
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50' 
        },
        { 
            label: 'Pending', 
            value: stats.pendingOrders, 
            icon: Clock, 
            color: 'bg-amber-500',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-50' 
        },
        { 
            label: 'Completed', 
            value: stats.completedOrders, 
            icon: CheckCircle, 
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50' 
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {statsData.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200`}
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
                        <div className="text-center sm:text-left mb-2 sm:mb-0">
                            <p className="text-stone-600 text-xs sm:text-sm font-medium">
                                {stat.label}
                            </p>
                            <p className={`text-lg sm:text-2xl font-bold ${stat.textColor} mt-1`}>
                                {stat.value}
                            </p>
                        </div>
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                            <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;