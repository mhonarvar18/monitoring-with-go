import React from 'react';
import { FiCamera, FiSettings, FiClock, FiTool } from 'react-icons/fi';

const CameraSetting: React.FC = () => {
    return (
        <>
            <div className="w-full h-full font-[iransans]" dir="rtl">
                <div className="w-full h-full flex flex-col justify-center items-center p-8">
                    {/* Main Icon */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200">
                            <FiCamera size={48} className="text-blue-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                            <FiSettings size={16} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                        تنظیمات دوربین
                    </h1>

                    {/* Coming Soon Badge */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full shadow-lg mb-6">
                        <div className="flex items-center gap-2">
                            <FiClock size={20} />
                            <span className="font-semibold text-lg">به زودی</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="max-w-md text-center mb-8">
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">
                            صفحه تنظیمات دوربین در حال توسعه است و به زودی در دسترس شما قرار خواهد گرفت.
                        </p>
                        <p className="text-gray-500 text-sm">
                            این بخش شامل تمامی تنظیمات مربوط به دوربین‌های سیستم خواهد بود.
                        </p>
                    </div>

                    {/* Features Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl w-full mb-8">
                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiCamera size={24} className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">مدیریت دوربین‌ها</h3>
                            <p className="text-sm text-gray-600">افزودن و حذف دوربین‌ها</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiSettings size={24} className="text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">تنظیمات پیشرفته</h3>
                            <p className="text-sm text-gray-600">کیفیت و نحوه ضبط</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center sm:col-span-2 lg:col-span-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiTool size={24} className="text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">ابزارهای کاربردی</h3>
                            <p className="text-sm text-gray-600">کالیبراسیون و تست</p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>در حال توسعه...</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CameraSetting;