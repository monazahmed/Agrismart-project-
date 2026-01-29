'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartIcon() {
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    return (
        <Link href="/marketplace/cart" className="relative">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </button>
        </Link>
    );
}
