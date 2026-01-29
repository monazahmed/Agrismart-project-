'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartSummary: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Your cart is empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start shopping to add items to your cart
                </p>
                <Link
                    href="/marketplace"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Cart Items ({getTotalItems()})
                </h2>

                <div className="space-y-3">
                    {cartItems.map((item) => {
                        const discountedPrice = item.discount
                            ? item.price * (1 - item.discount / 100)
                            : item.price;

                        return (
                            <div
                                key={item._id}
                                className="flex gap-4 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                            >
                                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-slate-700 rounded">
                                    {item.imageUrl && (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        ৳{discountedPrice.toFixed(2)} × {item.quantity}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.quantity - 1)
                                            }
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.quantity + 1)
                                            }
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end justify-between">
                                    <p className="font-bold text-green-600 dark:text-green-400">
                                        ৳{(discountedPrice * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal:</span>
                        <span>৳{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping:</span>
                        <span>৳100.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Tax:</span>
                        <span>৳{(getTotalPrice() * 0.15).toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ৳{(getTotalPrice() + 100 + getTotalPrice() * 0.15).toFixed(2)}
                    </span>
                </div>

                <Link
                    href="/marketplace/checkout"
                    className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                >
                    Proceed to Checkout
                </Link>

                <Link
                    href="/marketplace"
                    className="w-full block text-center mt-2 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold py-2 rounded-lg transition"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
