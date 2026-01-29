'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
    const router = useRouter();
    const [orderData, setOrderData] = React.useState<any>(null);

    useEffect(() => {
        // Get order data from session storage
        const storedData = sessionStorage.getItem('lastOrder');
        if (storedData) {
            setOrderData(JSON.parse(storedData));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="text-green-600 dark:text-green-400" size={40} />
                    </div>

                    {/* Main Message */}
                    <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        Thank you for shopping with AgriSmart. Your order has been successfully placed.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-6 mb-8 space-y-4 text-left">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-600">
                            <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                ORD-{Date.now()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-600">
                            <span className="text-gray-600 dark:text-gray-400">Order Status:</span>
                            <span className="inline-block bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
                                Processing
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-600">
                            <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                3-5 Business Days
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                        <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">
                            What's Next?
                        </h3>
                        <ol className="text-left space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                            <li>✓ Order confirmation email will be sent to your inbox</li>
                            <li>✓ You can track your order in your dashboard</li>
                            <li>✓ Delivery updates will be sent via SMS and email</li>
                            <li>✓ We're committed to safe and timely delivery</li>
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/dashboard"
                            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <Package size={20} />
                            Track Your Order
                        </Link>
                        <Link
                            href="/marketplace"
                            className="block w-full border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="block w-full border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Questions about your order?{' '}
                            <Link
                                href="/contact"
                                className="text-green-600 dark:text-green-400 hover:underline font-semibold"
                            >
                                Contact our support team
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
