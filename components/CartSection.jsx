import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";

const CartSection = () => {
    const { cartItems, removeFromCart, updateQuantity, total, clearCart, showToast } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const increaseQuantity = (item) => {
        updateQuantity(item.name, item.quantity + 1);
    };

    const decreaseQuantity = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.name, item.quantity - 1);
        } else {
            removeFromCart(item.name);
        }
    };

    // Always render CheckoutModal so the success confirmation can survive cart clearing
    const checkoutModal = (
        <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
        />
    );

    if (cartItems.length === 0) {
        return (
            <section id="cart" className="bg-white px-6 sm:px-8 py-16 sm:py-24 dark:bg-black">
                <div className="mx-auto max-w-screen-2xl text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <i className="fas fa-shopping-cart text-6xl text-gray-400"></i>
                    </div>
                    <h1 className="mb-4 text-5xl font-bold text-eliteGold">Your Cart is Empty</h1>
                    <p className="mb-10 text-xl text-gray-700 dark:text-gray-300">
                        Hungry? Our kitchen is ready.<br />Build your order for takeout or dine-in.
                    </p>
                    <a
                        href="#menu"
                        className="btn-primary inline-block px-10 py-4 text-xl"
                    >
                        Browse the Menu
                    </a>
                </div>
                {checkoutModal}
            </section>
        );
    }

    return (
        <section id="cart" className="bg-white px-6 sm:px-8 py-16 sm:py-24 dark:bg-black">
            <div className="mx-auto max-w-screen-2xl">
                <h1 className="mb-3 text-center text-5xl font-bold text-eliteGold">Your Cart</h1>
                <p className="mb-10 text-center text-lg text-gray-600 dark:text-gray-400">
                    Choose Takeout or Dine-in. We'll have it ready for you.
                </p>

                <div className="rounded-3xl bg-white p-8 md:p-10 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                    {cartItems.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="flex items-center justify-between border-b border-gray-200 py-6 last:border-0 dark:border-gray-700">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-eliteRed">{item.name}</h3>
                                {item.options && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                        {Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(' • ')}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-6">
                                {/* Quantity Controls */}
                                <div className="flex items-center rounded-2xl border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => decreaseQuantity(item)}
                                        className="w-11 h-11 flex items-center justify-center text-2xl font-bold text-eliteRed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-2xl transition active:bg-gray-200 dark:active:bg-gray-700"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center text-xl font-semibold text-black dark:text-white border-x border-gray-200 dark:border-gray-700 py-1">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increaseQuantity(item)}
                                        className="w-11 h-11 flex items-center justify-center text-2xl font-bold text-eliteRed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-2xl transition active:bg-gray-200 dark:active:bg-gray-700"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price */}
                                <span className="w-32 text-right text-2xl font-bold text-eliteGold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>

                                {/* Remove Item */}
                                <button
                                    onClick={() => removeFromCart(item.name)}
                                    className="text-eliteRed hover:text-black dark:hover:text-white transition text-xl"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-12 border-t-4 border-eliteGold pt-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-eliteRed">Order Total</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Taxes & fees calculated at checkout</p>
                            </div>
                            <span className="text-5xl font-bold text-eliteGold tabular-nums">${total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setIsCheckoutOpen(true)}
                                className="w-full premium-button py-4 text-xl"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <a
                                    href="tel:(956)258-5272"
                                    className="flex-1 text-center rounded-2xl border-2 border-eliteGold px-6 py-3.5 text-lg font-semibold text-eliteGold hover:bg-eliteGold hover:text-black transition"
                                >
                                    Call to Order Instead
                                </a>
                                <button
                                    onClick={() => {
                                        clearCart();
                                        showToast("Cart cleared");
                                    }}
                                    className="flex-1 rounded-2xl border-2 border-gray-300 dark:border-gray-700 px-6 py-3.5 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {checkoutModal}
        </section>
    );
};

export default CartSection;