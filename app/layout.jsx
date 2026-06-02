import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { HeartProvider } from "../context/HeartContext";
import ToastRenderer from "../components/ToastRenderer";
import Providers from "../components/Providers";

export const metadata = {
    title: "Elite Core Cuisine - Good Food, Great Mood",
    description: "Restaurant website built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Font Awesome for icons */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                />
                {/* Force light mode default to avoid dark flash */}
                <script dangerouslySetInnerHTML={{ __html: `
                    (function() {
                        try {
                            var saved = localStorage.getItem('darkMode');
                            if (saved !== 'true') {
                                document.documentElement.classList.remove('dark');
                            } else {
                                document.documentElement.classList.add('dark');
                            }
                        } catch (e) {}
                    })();
                ` }} />
            </head>
            <body>
                <Providers>
                    <HeartProvider>
                        <CartProvider>
                            {children}
                            <ToastRenderer />
                        </CartProvider>
                    </HeartProvider>
                </Providers>
            </body>
        </html>
    );
}