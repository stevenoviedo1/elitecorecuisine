import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-8 sm:grid-cols-2 md:grid-cols-4">
                {/* Our Locations */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <img 
                            src="/images/logo.png" 
                            alt="Elite Core Cuisine" 
                            className="h-9 w-auto rounded-lg border border-eliteGold/30" 
                        />
                        <img 
                            src="/images/elitecoffee.jpg" 
                            alt="Elite Coffee" 
                            className="h-10 w-10 rounded-full object-cover border border-eliteGold/30" 
                        />
                        <h3 className="text-2xl font-bold text-eliteGold">Visit Us</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <i className="fas fa-map-marker-alt mr-3 mt-1 text-eliteRed"></i>
                            <a
                                href="https://www.google.com/maps/place/Elite+Core+Cuisine/@26.1901119,-98.2014096,17z/data=!3m1!4b1!4m6!3m5!1s0x8665a1c9fee1970b:0x4a0fee06a9dd5621!8m2!3d26.1901071!4d-98.1988347!16s%2Fg%2F11g2kpv655?entry=ttu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition hover:text-eliteGold dark:hover:text-eliteRed"
                            >
                                1617 S Cage Blvd, Pharr, TX 78577
                            </a>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-phone mr-3 text-eliteRed"></i>
                            <a href="tel:(956)258-5272" className="transition hover:text-eliteGold dark:hover:text-eliteRed">
                                (956) 258-5272
                            </a>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-clock mr-3 text-eliteRed"></i>
                            <span>Open Daily • 10am – 9pm</span>
                        </li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="mb-6 text-2xl font-bold text-eliteGold">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="#home" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#dishes" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                                Popular Dishes
                            </a>
                        </li>
                        <li>
                            <a href="#menu" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                                Full Menu
                            </a>
                        </li>
                        <li>
                            <a href="#about" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="#cart" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                                Cart
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Hours */}
                <div>
                    <h3 className="mb-6 text-2xl font-bold text-eliteGold">Opening Hours</h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Monday - Thursday: 11:00 AM - 10:00 PM</li>
                        <li>Friday - Saturday: 11:00 AM - 11:00 PM</li>
                        <li>Sunday: 10:00 AM - 9:00 PM</li>
                        <li className="mt-4 font-semibold text-eliteGold">Breakfast Served Daily Until 2:00 PM</li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="mb-6 text-2xl font-bold text-eliteGold">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-eliteRed shadow-lg transition hover:bg-eliteGold hover:text-black"
                        >
                            <i className="fab fa-facebook-f text-lg"></i>
                        </a>
                        <a
                            href="#"
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-eliteRed shadow-lg transition hover:bg-eliteGold hover:text-black"
                        >
                            <i className="fab fa-instagram text-lg"></i>
                        </a>
                        <a
                            href="#"
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-eliteRed shadow-lg transition hover:bg-eliteGold hover:text-black"
                        >
                            <i className="fab fa-tiktok text-lg"></i>
                        </a>
                    </div>
                    <p className="mt-6 text-gray-700 dark:text-gray-300">
                        Stay connected for specials and events!
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">
                    © 2025 Elite Core Cuisine. All rights reserved.
                </p>
                <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                    Online ordering powered by our team dashboard + kitchen tickets. Pay in person.
                </p>
                <div className="mt-4 flex justify-center space-x-6 text-sm">
                    <a href="#" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-gray-700 transition hover:text-eliteGold dark:text-gray-300 dark:hover:text-eliteRed">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;