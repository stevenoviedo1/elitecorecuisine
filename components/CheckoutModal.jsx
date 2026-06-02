"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CheckoutModal = ({ isOpen, onClose }) => {
    const { cartItems, total, clearCart, showToast } = useCart();
    const [formData, setFormData] = useState({
        name: "",
        email: "",                    // optional - used for order confirmation email
        phone: "",
        orderType: "takeout",         // "takeout" or "dine-in"
        tableNumber: "",              // only for dine-in
        paymentPreference: "in-person",
        notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false); // independent persistent confirmation overlay

    // Only early-return if we're not in the middle of showing the success confirmation.
    // This prevents the confirmation from being unmounted when the parent clears the cart.
    if (!isOpen && !showSuccessConfirmation) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        // Table number is now optional for dine-in (user request)
        // if (formData.orderType === "dine-in" && !formData.tableNumber) {
        //     alert("Please enter the table number for dine-in orders.");
        //     return;
        // }

        setIsSubmitting(true);

        const orderPayload = {
            items: cartItems,
            total: total,
            customer: formData,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to place order');
            }

            const newOrderNumber = result.order.id;
            setOrderNumber(newOrderNumber);

            // Show the persistent confirmation while keeping the modal open
            // (we do NOT call onClose() here — only when user clicks the exit button)
            setShowSuccessConfirmation(true);

            // Show toast + clear cart
            showToast(`Order #${newOrderNumber} placed successfully!`);

            setTimeout(() => {
                clearCart();
            }, 400);

            // Only send receipt email for online payments (per business rule)
            if (formData.paymentPreference === 'online' && formData.email && formData.email.trim()) {
                fetch('/api/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order: result.order,
                        customer: formData,
                    }),
                }).catch(() => {
                    // Silent fail
                });
            }

        } catch (error) {
            console.error('Order error:', error);
            alert(`Order failed: ${error.message}. Please try again or call us.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset modal state when closing
        setOrderPlaced(false);
        setShowSuccessConfirmation(false);
        setFormData({
            name: "",
            email: "",
            phone: "",
            orderType: "takeout",
            tableNumber: "",
            paymentPreference: "in-person",
            notes: "",
        });
        onClose();
    };

    // Completely independent success confirmation overlay.
    // This will stay visible until the user explicitly clicks the exit button.
    // It is NOT tied to the parent's isOpen state.
    if (showSuccessConfirmation) {
        return (
            <div 
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-80 p-4"
                // No onClick close on backdrop — user must click the button
            >
                <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <i className="fas fa-check-circle text-6xl text-green-600 dark:text-green-400"></i>
                    </div>

                    <h2 className="mb-3 text-3xl font-bold text-eliteRed tracking-tight">Order Confirmed!</h2>
                    
                    <p className="mb-2 text-xl text-gray-700 dark:text-gray-200">
                        Thank you, {formData.name ? formData.name.split(" ")[0] : "there"}!
                    </p>

                    <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-100 px-5 py-1 dark:bg-emerald-900">
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">ORDER #</span>
                        <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums tracking-wider">
                            {orderNumber}
                        </span>
                    </div>

                    <p className="mb-6 text-base text-gray-600 dark:text-gray-400">
                        The kitchen has received your order and is preparing it now.
                        A kitchen ticket has been generated.
                        {formData.email && formData.email.trim() && (
                            <> A confirmation has been sent to <span className="font-medium">{formData.email}</span>.</>
                        )}
                    </p>

                    <div className="mb-8 rounded-2xl bg-gray-100 p-6 text-left dark:bg-gray-800">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {formData.orderType === "dine-in" ? "DINE-IN" : "TAKEOUT"}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                            {formData.orderType === "dine-in" 
                                ? `Table ${formData.tableNumber || '— (we will ask at counter)'}` 
                                : "Ready for pickup at counter"}
                        </div>
                        <div className="mt-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                            Estimated ready time: 15–25 minutes
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Pay in person when you pick up or at your table. Kitchen ticket printed.
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full rounded-2xl bg-eliteRed py-4 text-xl font-bold text-white transition hover:bg-eliteGold hover:text-black active:scale-[0.985]"
                    >
                        Back to Menu
                    </button>

                    <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                        Thank you for choosing Elite Core Cuisine
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-eliteRed">Checkout</h2>
                    <button
                        onClick={handleClose}
                        className="text-3xl text-gray-400 hover:text-eliteRed"
                        disabled={isSubmitting}
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Order Summary */}
                    <div className="border-b border-gray-200 p-6 sm:p-8 lg:w-2/5 lg:border-b-0 lg:border-r dark:border-gray-700">
                        <h3 className="mb-4 text-lg sm:text-xl font-bold text-eliteGold">Your Order</h3>
                        <div className="max-h-[220px] sm:max-h-[280px] space-y-2.5 overflow-auto pr-2 text-sm">
                            {cartItems.map((item) => (
                                <div key={item.name} className="flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {item.quantity}× {item.name}
                                    </span>
                                    <span className="font-medium text-black dark:text-white tabular-nums">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 sm:mt-6 border-t border-gray-300 pt-4 dark:border-gray-600">
                            <div className="flex items-center justify-between text-xl sm:text-2xl font-bold">
                                <span className="text-eliteRed">Total</span>
                                <span className="text-eliteGold tabular-nums">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8 lg:w-3/5">
                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg focus:border-eliteRed focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Email <span className="font-normal text-gray-400">(optional — receipt only sent for online payments; pay in person today)</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg focus:border-eliteRed focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg focus:border-eliteRed focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="(956) 555-1234"
                                />
                            </div>

                            {/* Order Type - Takeout or Dine-in (no delivery) */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Order Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition active:scale-[0.985] ${formData.orderType === 'takeout' ? 'border-eliteRed bg-eliteRed/5' : 'border-gray-200 dark:border-gray-700'}`}>
                                        <input
                                            type="radio"
                                            name="orderType"
                                            value="takeout"
                                            checked={formData.orderType === "takeout"}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div>
                                            <div className="font-semibold">Takeout</div>
                                            <div className="text-xs text-gray-500">Pickup at counter</div>
                                        </div>
                                    </label>
                                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition active:scale-[0.985] ${formData.orderType === 'dine-in' ? 'border-eliteRed bg-eliteRed/5' : 'border-gray-200 dark:border-gray-700'}`}>
                                        <input
                                            type="radio"
                                            name="orderType"
                                            value="dine-in"
                                            checked={formData.orderType === "dine-in"}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div>
                                            <div className="font-semibold">Dine In</div>
                                            <div className="text-xs text-gray-500">Eat here</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Table Number - only for Dine-in */}
                            {formData.orderType === "dine-in" && (
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Table Number <span className="font-normal text-gray-400">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="tableNumber"
                                        value={formData.tableNumber}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg focus:border-eliteRed focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                        placeholder="e.g. 12 or Patio 3"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">We'll bring your food right to the table if provided.</p>
                                </div>
                            )}

                            {/* Payment Preference - supports online or in-person */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Payment Preference
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition active:scale-[0.985] ${formData.paymentPreference === 'in-person' || !formData.paymentPreference ? 'border-eliteRed bg-eliteRed/5' : 'border-gray-200 dark:border-gray-700'}`}>
                                        <input
                                            type="radio"
                                            name="paymentPreference"
                                            value="in-person"
                                            checked={formData.paymentPreference === 'in-person' || !formData.paymentPreference}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div>
                                            <div className="font-semibold">Pay in Person</div>
                                            <div className="text-xs text-gray-500">At pickup or table</div>
                                        </div>
                                    </label>
                                    <label className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition opacity-60 cursor-not-allowed ${formData.paymentPreference === 'online' ? 'border-gray-400' : 'border-gray-200 dark:border-gray-700'}`}>
                                        <input
                                            type="radio"
                                            name="paymentPreference"
                                            value="online"
                                            checked={false}
                                            disabled
                                            className="hidden"
                                        />
                                        <div>
                                            <div className="font-semibold">Pay Online</div>
                                            <div className="text-xs text-gray-500">Coming soon</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Special Requests for the Kitchen (optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg focus:border-eliteRed focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="Extra spicy, no onions, gluten free, etc."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full premium-button py-4 sm:py-5 text-xl disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? "Placing Order..." : `Place Order • $${total.toFixed(2)}`}
                                </button>
                                <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                    Pay in person at pickup or your table. Kitchen ticket will be printed automatically.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
