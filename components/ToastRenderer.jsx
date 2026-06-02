"use client";

import { useCart } from "../context/CartContext";
import Toast from "./Toast";

export default function ToastRenderer() {
    const { toast, showToast } = useCart();

    if (!toast) return null;

    return (
        <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => showToast(null)} 
        />
    );
}