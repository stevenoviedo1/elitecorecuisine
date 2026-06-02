import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ReviewSection = () => {
    return (
        <section id="review" className="py-16 px-6 sm:px-8">
            <div className="max-w-screen-2xl mx-auto">
            <h3 className="text-center text-sm sm:text-base tracking-[2px] uppercase text-eliteGold mb-1">
                What People Are Saying
            </h3>
            <h1 className="text-center text-3xl sm:text-4xl font-bold text-eliteRed tracking-tight mb-2 sm:mb-3">
                Reviews From Guests
            </h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8 sm:mb-10">
                Top reviews from our guests • <a href="https://maps.app.goo.gl/VPMwKy2FmC2sAvLU8" target="_blank" rel="noopener noreferrer" className="text-eliteRed hover:underline">See all on Google</a>
            </p>
            <Swiper
                spaceBetween={16}
                slidesPerView={1}
                loop={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                }}
            >
                <SwiperSlide>
                    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 relative h-full flex flex-col hover:shadow-2xl transition-all">
                        <i className="fas fa-quote-right text-4xl text-gray-400 dark:text-gray-500 absolute top-4 right-4"></i>
                        <div className="mb-4">
                            <h3 className="text-xl text-gray-800 dark:text-gray-200 font-bold">Alexandra Garcia</h3>
                            <div className="flex space-x-1">
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                            </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">
                            Food was delicious. Our PSJA NORTH RAIDER BASKETBALL TEAM enjoyed their dinner!! Thank you!!
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">— Google Review</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 relative h-full flex flex-col hover:shadow-2xl transition-all">
                        <i className="fas fa-quote-right text-4xl text-gray-400 dark:text-gray-500 absolute top-4 right-4"></i>
                        <div className="mb-4">
                            <h3 className="text-xl text-gray-800 dark:text-gray-200 font-bold">Alex Rivera</h3>
                            <div className="flex space-x-1">
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                            </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">
                            If you're looking for fast and delicious food this is the place. The restaurant itself is very clean, staff is wonderful, the food is amazing as well as their coffees. My all time favorite is the Hibachi Bowl, the rice has such a great taste and texture, the meat is cooked to perfection and the veggies are incredible. I definitely recommend Elite Core Cuisine to everyone!
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">— Google Review</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 relative h-full flex flex-col hover:shadow-2xl transition-all">
                        <i className="fas fa-quote-right text-4xl text-gray-400 dark:text-gray-500 absolute top-4 right-4"></i>
                        <div className="mb-4">
                            <h3 className="text-xl text-gray-800 dark:text-gray-200 font-bold">Sofia Ramirez</h3>
                            <div className="flex space-x-1">
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                                <i className="fas fa-star text-eliteGold"></i>
                            </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">
                            As a coffee girly I loved their iced latte option which other buffets will not have for sure. The plate was a steal at just $14.95! Overall, our experience was great.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">— Google Review</p>
                    </div>
                </SwiperSlide>
            </Swiper>
            </div>
        </section>
    );
};

export default ReviewSection;