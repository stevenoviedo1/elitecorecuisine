"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const HeartContext = createContext();

export const useHeart = () => useContext(HeartContext);

export const HeartProvider = ({ children }) => {
    const [likedDishes, setLikedDishes] = useState(new Set()); // Set of dish names that are favorited

    useEffect(() => {
        const saved = localStorage.getItem("likedDishes");
        if (saved) {
            try {
                setLikedDishes(new Set(JSON.parse(saved)));
            } catch (e) {
                console.error("Failed to parse likedDishes");
            }
        }
    }, []);

    const toggleHeart = (dishName) => {
        setLikedDishes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(dishName)) {
                newSet.delete(dishName);
            } else {
                newSet.add(dishName);
            }
            localStorage.setItem("likedDishes", JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    const isLiked = (dishName) => likedDishes.has(dishName);

    // Optional: for showing popularity count if needed later, but now it's just liked state
    const getLikedCount = () => likedDishes.size;

    return (
        <HeartContext.Provider value={{ toggleHeart, isLiked, getLikedCount }}>
            {children}
        </HeartContext.Provider>
    );
};