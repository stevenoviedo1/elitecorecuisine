"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [toast, setToast] = useState(null); // { message, type }

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        // Auto clear after 2.2s (handled in Toast component too)
        setTimeout(() => setToast(null), 2400);
    };

    // Load cart from localStorage on mount (temporary persistence until real backend)
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse saved cart");
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, options = {}) => {
        setCartItems((prev) => {
            // Create a unique key based on name + options for grouping similar items
            const itemKey = JSON.stringify({ name: item.name, options });

            const existing = prev.find((i) => 
                i.name === item.name && 
                JSON.stringify(i.options || {}) === JSON.stringify(options)
            );

            if (existing) {
                return prev.map((i) =>
                    i.name === item.name && 
                    JSON.stringify(i.options || {}) === JSON.stringify(options)
                        ? { ...i, quantity: i.quantity + 1 } 
                        : i
                );
            }

            return [...prev, { 
                ...item, 
                quantity: 1, 
                options: Object.keys(options).length > 0 ? options : undefined 
            }];
        });
    };

    const removeFromCart = (name) => {
        setCartItems((prev) => prev.filter((i) => i.name !== name));
    };

    const updateQuantity = (name, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((i) =>
                i.name === name ? { ...i, quantity: newQuantity } : i
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                toast,
                showToast,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};