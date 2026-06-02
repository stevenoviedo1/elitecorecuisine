import React, { useState } from "react";
import { menuData, getAllMenuItems } from "../data/menu";
import MenuCard from "./MenuCard";

const MenuSection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = menuData.categories;

    // Filter items based on search and category
    const filteredItems = getAllMenuItems().filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || 
                               categories.find(cat => cat.items.some(i => i.id === item.id))?.id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group filtered items by category for display
    const grouped = categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
            filteredItems.some(fi => fi.id === item.id)
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <section id="menu" className="bg-white px-6 sm:px-8 py-12 sm:py-16 dark:bg-black">
            <div className="max-w-screen-2xl mx-auto">
                <h3 className="mb-1.5 sm:mb-2 text-center text-2xl sm:text-3xl font-bold text-eliteGold tracking-[2px] uppercase">
                    Our Menu
                </h3>
                <h1 className="mb-2 sm:mb-3 text-center text-4xl sm:text-5xl font-bold uppercase text-eliteRed tracking-[-1px]">
                    Elite Core Cuisine
                </h1>
                <p className="mx-auto mb-8 sm:mb-10 max-w-3xl text-center text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    Fresh, healthy options crafted with premium ingredients. Dine in with us or order for takeout.
                </p>

                {/* State-of-the-art controls: Search + Category Tabs */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-lg focus:outline-none focus:border-eliteRed transition"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === "all" ? "bg-eliteRed text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat.id ? "bg-eliteRed text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modern menu display - state of the art cards with user's custom images only */}
                {grouped.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No items match your search.
                    </div>
                ) : (
                    grouped.map((category) => (
                        <div key={category.id} className="mb-14 sm:mb-20">
                            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-eliteGold tracking-tight">
                                    {category.name}
                                </h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-eliteGold/30 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {category.items.map((item) => (
                                    <MenuCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default MenuSection;