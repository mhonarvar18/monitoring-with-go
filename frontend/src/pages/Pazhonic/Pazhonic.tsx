import React from "react";
import { toPersianDigits } from "../../utils/numberConvert";
import PazhLogoLarge from "../../assets/icons/PazhLogoLarge.svg";
import PazhLogoTypo from "../../assets/icons/PazhLogoTypo";
import { motion } from "framer-motion";

interface Service {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const services: Service[] = [
  {
    icon: "🖥️",
    title: "سیستم‌های نظارتی",
    description: "طراحی و پیاده‌سازی سیستم‌های نظارت پیشرفته",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: "🔌",
    title: "تجهیزات الکترونیکی",
    description: "توسعه و تولید قطعات و ماژول‌های الکترونیکی",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: "📡",
    title: "راه‌کارهای IoT",
    description: "پیاده‌سازی سیستم‌های اینترنت اشیاء",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: "🛡️",
    title: "امنیت سایبری",
    description: "حفاظت و امنیت سیستم‌های الکترونیکی",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: "⚙️",
    title: "اتوماسیون",
    description: "سیستم‌های کنترل و اتوماسیون صنعتی",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: "🔧",
    title: "نگهداری و پشتیبانی",
    description: "خدمات نگهداری و پشتیبانی تخصصی",
    color: "from-indigo-500 to-blue-600",
  },
];

const Pazhonic: React.FC = () => {
  return (
    <div className="w-full h-full font-[iransans]" dir="rtl">
      <div className="w-full h-full lg:pt-2 lg:pb-10 gap-2 3xl:pt-3 lg:px-4 2xl:px-4">
        <div className="w-full h-full flex flex-col justify-start items-center gap-8">
          <div className="w-full relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-lg shadow-2xl overflow-hidden min-h-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-600/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative z-10 p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-white">
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      فعال و آماده خدمت‌رسانی
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      پاژونیک
                    </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                    پیشرو در توسعه سیستم‌های الکترونیکی و راه‌کارهای هوشمند
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                      <span className="text-2xl font-bold" dir="ltr">
                        +{toPersianDigits("20")}
                      </span>
                      <p className="text-sm text-blue-200">سال تجربه</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                      <span className="text-2xl font-bold" dir="ltr">
                        +{toPersianDigits(100)}
                      </span>
                      <p className="text-sm text-blue-200">پروژه موفق</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                      <span className="text-2xl font-bold" dir="ltr">
                        {toPersianDigits("24/7")}
                      </span>
                      <p className="text-sm text-blue-200">پشتیبانی</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <div className="text-8xl flex flex-col justify-start items-center gap-4">
                        <motion.img
                          src={PazhLogoLarge}
                          alt="PazhLogoLarge"
                          width={140}
                          height={180}
                          animate={{
                            rotateY: [0, 360], // Rotate along the Y-axis for a 3D effect
                            scale: [1, 1.05, 1], // Optional: Scale up and then down
                            opacity: [1, 0.7, 1], // Optional: Fade out and back in
                          }}
                          transition={{
                            repeat: Infinity, // Loop the animation infinitely
                            duration: 6, // Adjust for faster or slower animation speed
                            ease: "easeInOut", // Smooth transition between animation states
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-center gap-8 min-h-fit">
            <div className="w-full text-center">
              <h2 className="w-full text-3xl font-bold text-slate-800 mb-4">
                خدمات ما
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10 p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-slate-900">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                      {service.description}
                    </p>
                    <div
                      className={`w-12 h-1 bg-gradient-to-r ${service.color} rounded-full mt-6 group-hover:w-20 transition-all duration-300`}
                    ></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-12 flex flex-col justify-start items-center gap-12 min-h-fit">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                ارزش‌های ما
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "کیفیت",
                  description: "تعهد به ارائه بالاترین کیفیت در تمام پروژه‌ها",
                },
                {
                  icon: "🚀",
                  title: "نوآوری",
                  description: "استفاده از جدیدترین تکنولوژی‌ها و روش‌های نوین",
                },
                {
                  icon: "🤝",
                  title: "اعتماد",
                  description: "ایجاد روابط بلندمدت مبتنی بر اعتماد و شفافیت",
                },
              ].map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full min-h-fit bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-lg px-12 py-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold">
                  آماده همکاری با شما هستیم
                </h2>
                <p className="text-xl text-blue-100">
                  برای مشاوره و دریافت راه‌کار مناسب پروژه خود با ما در تماس
                  باشید
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <div className="text-right">
                      <p className="text-sm text-blue-200">تماس مستقیم</p>
                      <p className="font-bold">۰۲۱-۸۶۱۲۶۳۴۹</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📧</span>
                    <div className="text-right">
                      <p className="text-sm text-blue-200">ایمیل</p>
                      <p className="font-bold">info@pazhonic.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pazhonic;
