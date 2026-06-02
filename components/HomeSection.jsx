import React from "react";

const HomeSection = () => {
    return (
        <section
            id="home"
            className="bg-white px-6 pb-20 pt-28 sm:pb-24 sm:pt-32 dark:bg-black"
        >
            <div className="mx-auto max-w-screen-2xl">
                <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16 md:items-center">
                    <div className="w-full max-w-3xl text-center md:text-left lg:max-w-3xl xl:max-w-4xl">
                        <h2 className="mb-6 sm:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-eliteGold tracking-tight">
                            Authentic Mexican Flavors<br />
                            Crafted with Passion
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                            Experience the rich culinary heritage of Mexico at Elite Core Cuisine. 
                            From street-style tacos to hearty plates and fresh salads, 
                            every dish is made with traditional recipes and the finest ingredients — just like family would make it.
                        </p>
                        <p className="mt-2 text-sm font-medium text-eliteGold">
                            Whether you're dining in with us or grabbing takeout, we can't wait to serve you.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 md:justify-start">
                            <a href="#menu" className="btn-primary text-center">View Menu</a>
                            <a href="#cart" className="btn-secondary text-center">Order Now</a>
                        </div>
                    </div>

                    {/* Hero image crossfade - balanced width for premium wide layout */}
                    <div className="relative w-full max-w-lg lg:max-w-xl flex-1 md:mt-0">
                        <div className="relative h-[320px] sm:h-[420px] w-full md:h-[520px]">
                            <img
                                src="/images/Image1.png"
                                alt="Elite Core Cuisine Signature Dish"
                                className="hero-fade absolute left-0 top-0 h-full w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5"
                            />
                            <img
                                src="/images/Image5.png"
                                alt="Hearty Mexican Plate"
                                className="hero-fade absolute left-0 top-0 h-full w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5"
                            />
                            <img
                                src="/images/Image4.png"
                                alt="Fresh Street-Style Tacos"
                                className="hero-fade absolute left-0 top-0 h-full w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeSection;