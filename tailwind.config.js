/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",  // Added for Next.js App Router support
    ],
    darkMode: "class",  // Enables dark/light mode toggle using .dark class on <html>
    theme: {
        extend: {
            colors: {
                // Your brand colors
                eliteRed: "#C41E3A", // Rich, elegant red
                eliteGold: "#D4AF37", // Classic metallic gold
                eliteBlack: "#000000", // Pure black
                eliteWhite: "#FFFFFF", // Pure white for contrast
                // Optional softer variations (useful for hover, backgrounds, etc.)
                eliteRedDark: "#A01830", // Darker red for hover
                eliteGoldLight: "#E8C474", // Lighter gold for accents
                eliteGray: "#1A1A1A", // Dark gray for secondary text
                eliteLightGray: "#E5E5E5", // Light gray for backgrounds
            },
        },
    },
    plugins: [],
};