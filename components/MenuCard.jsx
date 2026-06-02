"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useHeart } from "../context/HeartContext";

const MenuCard = ({ item, variant = "default" }) => {
    const { addToCart, showToast } = useCart();
    const { toggleHeart, isLiked } = useHeart();

    const isCompact = variant === "compact";

    return (
        <div className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-eliteGold/30 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ${isCompact ? "p-5 text-center" : ""}`}>
            <div className="relative overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className={`transition-transform duration-500 group-hover:scale-105 ${isCompact ? "mx-auto mb-4 h-32 w-32 rounded-xl object-cover" : "h-48 sm:h-56 w-full object-cover"}`}
                    onError={(e) => {
                        e.currentTarget.src = "/images/Image1.png";
                    }}
                />

                {/* Heart Button - Favorite Toggle (state of the art: red when liked, gray otherwise, smooth toggle) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleHeart(item.name);
                        showToast(isLiked(item.name) ? `${item.name} removed from favorites` : `${item.name} added to favorites`);
                    }}
                    className={`absolute ${isCompact ? "left-3 top-3" : "right-3 top-3"} rounded-full bg-white/90 p-2.5 shadow transition-all duration-200 hover:scale-110 active:scale-95 ${isLiked(item.name) ? 'text-eliteGold scale-110' : 'text-gray-400 hover:text-eliteGold'}`}
                    aria-label={isLiked(item.name) ? "Remove from favorites" : "Add to favorites"}
                >
                    <i className={`fas fa-heart transition-colors ${isLiked(item.name) ? 'text-eliteGold' : ''}`}></i>
                </button>
            </div>

            <div className={isCompact ? "" : "p-6 text-center space-y-3"}>
                <h4 className="mb-1.5 text-xl font-bold text-eliteRed leading-tight">{item.name}</h4>

                {item.description && (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.6rem]">
                        {item.description}
                    </p>
                )}

                <span className="block text-2xl font-bold text-eliteGold tabular-nums tracking-tight">
                    ${item.price.toFixed(2)}
                    {item.priceRange && ` - ${item.priceRange}`}
                </span>

                <button
                    onClick={() => {
                        addToCart({ name: item.name, price: item.price });
                        showToast(`${item.name} added to cart`);
                    }}
                    className={`mt-4 w-full bg-gradient-to-r from-eliteRed to-eliteRed hover:from-eliteGold hover:to-eliteGold text-white hover:text-black px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.985] min-h-[48px] flex items-center justify-center gap-2 ${
                        isCompact ? "p-3 text-lg" : ""
                    }`}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
