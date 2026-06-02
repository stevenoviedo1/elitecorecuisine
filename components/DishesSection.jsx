import React from "react";
import { menuData } from "../data/menu";
import { useCart } from "../context/CartContext";
import { useHeart } from "../context/HeartContext";

const DishesSection = () => {
    const { addToCart, showToast } = useCart();
    const { toggleHeart, isLiked } = useHeart();

    const mainCategory = menuData.categories.find((c) => c.id === "main");

    return (
        <section id="dishes" className="bg-white px-6 sm:px-8 py-24 dark:bg-black">
            <div className="max-w-screen-2xl mx-auto">
            <h3 className="mb-2 text-center text-3xl font-bold text-eliteGold">
                Our Popular Dishes
            </h3>
            <h1 className="mb-12 text-center text-5xl font-bold uppercase tracking-tight text-eliteRed">
                Fresh Favorites
            </h1>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mainCategory?.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-eliteGold/30"
                    >
                        <div className="group relative overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-48 sm:h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/Image1.png";
                                }}
                            />
                            <div className="absolute left-4 top-4">
                                <button
                                    onClick={() => {
                                        const currentlyLiked = isLiked(item.name);
                                        toggleHeart(item.name);
                                        showToast(currentlyLiked ? `${item.name} removed from favorites` : `${item.name} added to favorites`);
                                    }}
                                    className={`relative rounded-full bg-white p-3 shadow transition-all duration-200 hover:scale-110 active:scale-95 ${isLiked(item.name) ? 'text-eliteGold scale-110' : 'text-gray-400 hover:text-eliteGold'}`}
                                    aria-label={isLiked(item.name) ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <i className={`fas fa-heart text-xl transition-colors ${isLiked(item.name) ? 'text-eliteGold' : ''}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-grow flex-col justify-between p-8 text-center">
                            <div>
                                <h3 className="mb-4 text-2xl font-bold text-eliteRed">{item.name}</h3>
                                <span className="mb-8 block text-3xl font-bold text-eliteGold">
                                    ${item.price.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={() => addToCart({ name: item.name, price: item.price })}
                                className="bg-eliteRed hover:bg-eliteGold text-white hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </section>
    );
};

export default DishesSection;