import React from "react";
import { menuData } from "../data/menu";
import MenuCard from "./MenuCard";

const CategorySection = () => {
    const featuredCategory = menuData.categories.find((c) => c.id === "combination");

    return (
        <section className="bg-white px-6 sm:px-8 py-16 dark:bg-black">
        <div className="max-w-screen-2xl mx-auto">
            <h3 className="mb-10 text-center text-3xl font-bold text-eliteGold">
                Featured Combos
            </h3>

            {featuredCategory && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {featuredCategory.items.map((item) => (
                        <MenuCard key={item.id} item={item} variant="compact" />
                    ))}
                </div>
            )}
            </div>
        </section>
    );
};

export default CategorySection;