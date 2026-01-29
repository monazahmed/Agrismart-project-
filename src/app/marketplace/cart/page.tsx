'use client';

import React from 'react';
import CartSummary from '@/components/marketplace/CartSummary';

export default function CartPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review your items and proceed to checkout
                    </p>
                </div>

                <CartSummary />
            </div>
        </div>
    );
}
