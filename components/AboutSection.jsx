import React from "react";

const AboutSection = () => {
    return (
        <section id="about" className="bg-white px-6 sm:px-8 py-16 dark:bg-black">
            <div className="max-w-screen-2xl mx-auto">
            <div className="grid items-center gap-12 md:grid-cols-2">
                <div>
                    <img
                        src="/images/about-img.png"
                        alt="Elite Core Cuisine"
                        className="w-full rounded-3xl shadow-2xl ring-1 ring-black/5"
                    />
                </div>
                <div>
                    <h3 className="mb-6 text-5xl font-bold text-eliteGold tracking-tight">
                        Where Tradition Meets Excellence
                    </h3>
                    <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
                        At Elite Core Cuisine, we bring authentic Mexican flavors to life with passion and precision.
                    </p>
                    <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
                        From street-style tacos to hearty breakfast plates and fresh chicken salads, every dish is crafted with fresh ingredients and family tradition. Whether you're dining in or ordering for pickup, we serve it with the same care.
                    </p>
                    <div className="mb-10 grid grid-cols-2 gap-8">
                        <div className="flex items-start space-x-4">
                            <i className="fas fa-utensils text-4xl text-eliteRed"></i>
                            <div>
                                <h4 className="text-xl font-bold text-eliteGold">Authentic Flavors</h4>
                                <p className="text-gray-600 dark:text-gray-400">Traditional recipes with fresh ingredients</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <i className="fas fa-heart text-4xl text-eliteRed"></i>
                            <div>
                                <h4 className="text-xl font-bold text-eliteGold">Made with Love</h4>
                                <p className="text-gray-600 dark:text-gray-400">Every plate prepared with care</p>
                            </div>
                        </div>
                    </div>
                    <a href="#menu" className="inline-block rounded-2xl bg-eliteRed px-8 py-4 text-lg font-semibold text-white transition hover:bg-eliteGold hover:text-black">
                        Explore Our Story
                    </a>
                </div>
            </div>
            </div>
        </section>
    );
};

export default AboutSection;