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
            className="fixed right-6 top-6 z-50 rounded-full bg-eliteGold p-3 text-eliteBlack shadow-2xl transition hover:bg-eliteRed hover:text-white"
            aria-label="Toggle dark/light mode"
        >
            {isDark ? (
                <i className="fas fa-sun text-2xl"></i>  // Sun = switch to light
            ) : (
                <i className="fas fa-moon text-2xl"></i>  // Moon = switch to dark
            )}
        </button>
    );
};

export default DarkModeToggle;