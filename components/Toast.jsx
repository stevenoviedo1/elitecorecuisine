"use client";

import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 2200);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === "success" 
        ? "bg-emerald-600" 
        : "bg-eliteRed";

    return (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2">
            <div className={`${bgColor} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium`}>
                <i className={`fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} text-lg`}></i>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;