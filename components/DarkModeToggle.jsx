import React, { useState, useEffect } from "react";

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Always default to light mode unless user explicitly chose dark
        const saved = localStorage.getItem("darkMode");
        const initial = saved === "true"; // only dark if explicitly saved as true
        setIsDark(initial);
        if (initial) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleMode = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.removeItem("darkMode"); // remove to default to light
        }
    };

    return (
        <button
            onClick={toggleMode}
            className="fixed right-4 top-4 z-50 rounded-full bg-eliteGold p-2 text-eliteBlack shadow-2xl transition hover:bg-eliteRed hover:text-white sm:right-6 sm:top-6 sm:p-3"
            aria-label="Toggle dark/light mode"
        >
            {isDark ? (
                <i className="fas fa-sun text-xl sm:text-2xl"></i>  // Sun = switch to light
            ) : (
                <i className="fas fa-moon text-xl sm:text-2xl"></i>  // Moon = switch to dark
            )}
        </button>
    );
};

export default DarkModeToggle;