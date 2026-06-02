"use client";

import { useState } from "react";
import Header from "../components/Header";
import HomeSection from "../components/HomeSection";
import CategorySection from "../components/CategorySection";
import DishesSection from "../components/DishesSection";
import AboutSection from "../components/AboutSection";
import MenuSection from "../components/MenuSection";
import ReviewSection from "../components/ReviewSection";
import CartSection from "../components/CartSection";
import Footer from "../components/Footer";
import DarkModeToggle from "../components/DarkModeToggle";
import { useCart } from "../context/CartContext";

export default function Home() {
    const { cartItems } = useCart();
    const [showCartHint, setShowCartHint] = useState(false);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const scrollToCart = () => {
        const cartEl = document.getElementById('cart');
        if (cartEl) {
            cartEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <HomeSection />
                <CategorySection />
                <DishesSection />
                <AboutSection />
                <MenuSection />
                <ReviewSection />
                <CartSection />
            </main>
            <Footer />
            <DarkModeToggle />

            {/* Floating Cart Button (mobile + desktop convenience) */}
            {totalItems > 0 && (
                <button
                    onClick={scrollToCart}
                    className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full bg-eliteRed pl-5 pr-6 py-3.5 text-white shadow-2xl transition-all hover:bg-eliteGold hover:text-black active:scale-[0.985] md:bottom-8 md:right-8"
                    aria-label="View your cart"
                >
                    <div className="flex items-center gap-2.5">
                        <i className="fas fa-shopping-cart text-xl"></i>
                        <span className="hidden sm:inline font-semibold text-sm tracking-tight">
                            {totalItems} item{totalItems > 1 ? 's' : ''}
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
}