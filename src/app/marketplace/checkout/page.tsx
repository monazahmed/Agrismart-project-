'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ChevronRight, Home } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getTotalPrice, clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        state: '',
        country: '',
    });

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                            Your cart is empty
                        </p>
                        <Link
                            href="/marketplace"
                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (
                !formData.fullName ||
                !formData.email ||
                !formData.phone ||
                !formData.address
            ) {
                alert('Please fill in all required fields');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const subtotal = getTotalPrice();
    const shipping = 100;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-8">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Steps Indicator */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
                            <div className="flex items-center justify-between">
                                {['Shipping', 'Payment', 'Confirmation'].map((label, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center ${i < 2 ? 'flex-1' : ''
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > i + 1
                                                    ? 'bg-green-600 text-white'
                                                    : step === i + 1
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {step > i + 1 ? '✓' : i + 1}
                                        </div>
                                        <span className={`ml-3 font-semibold ${step >= i + 1
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {label}
                                        </span>
                                        {i < 2 && (
                                            <ChevronRight
                                                size={20}
                                                className="ml-auto text-gray-400"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 1: Shipping Address */}
                        {step === 1 && (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Shipping Address
                                </h2>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+880123456789"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Farm Road"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Dhaka"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            State/Region
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Dhaka"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            ZIP Code
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="1000"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="Bangladesh"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mt-6"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <PaymentStep
                                onNext={handleNext}
                                onBack={() => setStep(1)}
                                formData={formData}
                                total={total}
                            />
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <OrderConfirmation
                                formData={formData}
                                cartItems={cartItems}
                                total={total}
                                onComplete={() => {
                                    clearCart();
                                    router.push('/marketplace/order-confirmation');
                                }}
                            />
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            ৳{((item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Subtotal:</span>
                                    <span>৳{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Shipping:</span>
                                    <span>৳{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Tax (15%):</span>
                                    <span>৳{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900 dark:text-white">Total:</span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    ৳{total.toFixed(2)}
                                </span>
                            </div>

                            <Link
                                href="/marketplace/cart"
                                className="w-full block text-center mt-4 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold py-2 rounded-lg transition"
                            >
                                Edit Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Payment Step Component
function PaymentStep({
    onNext,
    onBack,
    formData,
    total,
}: {
    onNext: () => void;
    onBack: () => void;
    formData: any;
    total: number;
}) {
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const response = await fetch('/api/marketplace/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: `ORD-${Date.now()}`,
                    amount: total,
                    paymentMethod,
                    cardDetails: cardData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                onNext();
            } else {
                alert(data.error || 'Payment failed');
            }
        } catch (error) {
            alert('Payment processing error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Method
            </h2>

            <div className="space-y-3">
                {['credit-card', 'debit-card', 'mobile-wallet', 'bank-transfer'].map(
                    (method) => (
                        <label key={method} className="flex items-center p-4 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                            <input
                                type="radio"
                                name="payment"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span className="ml-3 font-semibold text-gray-900 dark:text-white">
                                {method === 'credit-card' && '💳 Credit Card'}
                                {method === 'debit-card' && '🏧 Debit Card'}
                                {method === 'mobile-wallet' && '📱 Mobile Wallet'}
                                {method === 'bank-transfer' && '🏦 Bank Transfer'}
                            </span>
                        </label>
                    )
                )}
            </div>

            {paymentMethod === 'credit-card' && (
                <div className="mt-6 space-y-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            placeholder="4532 1234 5678 9010"
                            maxLength={19}
                            value={cardData.cardNumber}
                            onChange={(e) =>
                                setCardData({ ...cardData, cardNumber: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={cardData.cardHolder}
                            onChange={(e) =>
                                setCardData({ ...cardData, cardHolder: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardData.expiryDate}
                                onChange={(e) =>
                                    setCardData({ ...cardData, expiryDate: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                CVV
                            </label>
                            <input
                                type="password"
                                placeholder="123"
                                maxLength={3}
                                value={cardData.cvv}
                                onChange={(e) =>
                                    setCardData({ ...cardData, cvv: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold py-3 rounded-lg transition"
                >
                    Back
                </button>
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                >
                    {processing ? 'Processing...' : 'Pay ৳' + total.toFixed(2)}
                </button>
            </div>
        </div>
    );
}

// Order Confirmation Component
function OrderConfirmation({
    formData,
    cartItems,
    total,
    onComplete,
}: {
    formData: any;
    cartItems: any[];
    total: number;
    onComplete: () => void;
}) {
    const orderId = `ORD-${Date.now()}`;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    Order Confirmed!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Order ID
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {orderId}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Delivery Address
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {formData.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.address}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.city}, {formData.zipCode}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Contact
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {formData.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.phone}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                    Order Items
                </h3>
                <div className="space-y-2">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {item.name} × {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                ৳{((item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total Amount:</span>
                    <span className="text-green-600 dark:text-green-400">
                        ৳{total.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    📦 Your order will be delivered within 3-5 business days. You'll receive a tracking number via email.
                </p>
            </div>

            <button
                onClick={onComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
                <Home size={20} />
                Back to Home
            </button>
        </div>
    );
}
