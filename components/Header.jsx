import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useHeart } from "../context/HeartContext";
import { getAllMenuItems } from "../data/menu";

const Header = () => {
    const [navActive, setNavActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { cartItems, addToCart, showToast } = useCart();
    const { getLikedCount } = useHeart();

    const allMenuItems = getAllMenuItems();

    const toggleNav = () => setNavActive(!navActive);

    const openSearch = () => {
        setSearchActive(true);
        setSearchTerm("");
    };

    const closeSearch = () => {
        setSearchActive(false);
        setSearchTerm("");
    };

    const filteredResults = searchTerm.length > 1
        ? allMenuItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 8)
        : [];

    return (
        <header className="fixed left-0 right-0 top-0 z-50 bg-eliteBlack shadow-2xl">
            <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 lg:px-8 py-6">
                {/* Logo + Text */}
                <Link href="/" className="flex items-center space-x-3 sm:space-x-5">
                    <img
                        src="/images/logo.png"
                        alt="Elite Core Cuisine Logo"
                        className="h-14 sm:h-20 w-auto rounded-xl border border-eliteGold/30"
                    />
                    <img
                        src="/images/elitecoffee.jpg"
                        alt="Elite Coffee Logo"
                        className="h-12 sm:h-16 w-12 sm:w-16 rounded-full object-cover border border-eliteGold/30"
                    />
                    <div>
                        <span className="text-2xl sm:text-3xl font-extrabold tracking-wider text-eliteGold transition hover:text-eliteRed block">
                            Elite Core Cuisine
                        </span>
                        <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Open Daily • 10am – 9pm
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden space-x-14 md:flex">
                    <a href="#home" className="text-2xl font-medium text-black transition hover:text-eliteGold dark:text-gray-200 dark:hover:text-eliteGold">
                        Home
                    </a>
                    <a href="#dishes" className="text-2xl font-medium text-black transition hover:text-eliteGold dark:text-gray-200 dark:hover:text-eliteGold">
                        Dishes
                    </a>
                    <a href="#about" className="text-2xl font-medium text-black transition hover:text-eliteGold dark:text-gray-200 dark:hover:text-eliteGold">
                        About
                    </a>
                    <a href="#menu" className="text-2xl font-medium text-black transition hover:text-eliteGold dark:text-gray-200 dark:hover:text-eliteGold">
                        Menu
                    </a>
                    <a href="#review" className="text-2xl font-medium text-black transition hover:text-eliteGold dark:text-gray-200 dark:hover:text-eliteGold">
                        Reviews
                    </a>
                </nav>

                {/* Icons - evenly spaced premium controls */}
                <div className="flex items-center gap-6 md:gap-8">
                    <button
                        onClick={openSearch}
                        className="p-2 text-3xl text-eliteGold transition hover:text-eliteRed active:text-eliteRed"
                        title="Search menu"
                    >
                        <i className="fas fa-search"></i>
                    </button>
                    <a href="tel:(956)258-5272" className="hidden md:block p-2 text-3xl text-eliteGold transition hover:text-eliteRed active:text-eliteRed" title="Call us">
                        <i className="fas fa-phone"></i>
                    </a>
                    <a href="#dishes" className="relative p-2 text-3xl text-eliteGold transition hover:text-eliteRed active:text-eliteRed" title="View your favorites">
                        <i className="fas fa-heart"></i>
                        {getLikedCount() > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-eliteGold text-[10px] font-bold text-black">
                                {getLikedCount()}
                            </span>
                        )}
                    </a>
                    <a href="#cart" className="relative p-2 text-3xl text-eliteGold transition hover:text-eliteRed active:text-eliteRed" title="Your Cart">
                        <i className="fas fa-shopping-cart"></i>
                        {/* Cart Badge */}
                        {cartItems.length > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-eliteGold text-xs font-bold text-black shadow-lg">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </a>
                    <button
                        onClick={toggleNav}
                        className="p-2 text-3xl text-eliteGold transition hover:text-eliteRed md:hidden active:text-eliteRed"
                        title="Menu"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {navActive && (
                <div className="bg-eliteBlack shadow-2xl md:hidden border-t border-gray-200 dark:border-gray-700">
                    <nav className="flex flex-col px-6 py-2 text-lg">
                        {[
                            { href: "#home", label: "Home" },
                            { href: "#dishes", label: "Popular Dishes" },
                            { href: "#menu", label: "Full Menu" },
                            { href: "#about", label: "About Us" },
                            { href: "#review", label: "Reviews" },
                            { href: "#cart", label: "Your Cart" },
                        ].map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="py-4 text-lg text-black transition hover:text-eliteGold dark:text-gray-200 dark:hover:text-eliteGold border-b border-gray-200 dark:border-gray-700 last:border-0 active:bg-gray-100 dark:active:bg-gray-800"
                                onClick={() => setNavActive(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a 
                            href="tel:(956)258-5272" 
                            className="py-4 text-lg text-eliteRed font-semibold flex items-center gap-2 active:bg-gray-100 dark:active:bg-gray-800"
                            onClick={() => setNavActive(false)}
                        >
                            <i className="fas fa-phone"></i> Call Us
                        </a>
                    </nav>
                </div>
            )}

            {/* Search Panel */}
            {searchActive && (
                <div className="absolute left-4 right-4 md:left-auto md:right-8 top-24 w-auto md:w-[420px] rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                        <i className="fas fa-search text-eliteGold text-xl ml-1"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tacos, plates, fajitas..."
                            className="flex-1 bg-transparent text-lg text-black dark:text-white placeholder-gray-400 focus:outline-none py-1"
                            autoFocus
                        />
                        <button
                            onClick={closeSearch}
                            className="text-2xl text-gray-400 hover:text-eliteRed transition"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Live Results */}
                    <div className="max-h-[380px] overflow-auto p-2">
                        {searchTerm.length > 1 && filteredResults.length > 0 ? (
                            filteredResults.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition group"
                                >
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-12 h-12 rounded-lg object-cover" 
                                        />
                                        <div>
                                            <div className="font-semibold text-black dark:text-white group-hover:text-eliteRed">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ${item.price.toFixed(2)} {item.description && `· ${item.description}`}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart({ name: item.name, price: item.price });
                                            showToast(`${item.name} added to cart`);
                                            closeSearch();
                                        }}
                                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-eliteRed text-white hover:bg-eliteGold hover:text-black transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        ) : searchTerm.length > 1 ? (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No results for “{searchTerm}”. Try tacos or fajita.
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                                Start typing to search our menu...
                            </div>
                        )}
                    </div>

                    {filteredResults.length > 0 && (
                        <div className="px-4 py-3 text-xs text-center text-gray-400 border-t border-gray-200 dark:border-gray-700">
                            Click “Add” to instantly add to cart
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;