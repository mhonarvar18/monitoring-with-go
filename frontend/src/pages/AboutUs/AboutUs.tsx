interface Props {
    darkMode?: boolean;
}

const AboutUs: React.FC<Props> = ({
    darkMode
}) => {
  return (
    <>
      <div className="w-full h-full py-16 px-12 font-[iransans]">
        <div
          className={`w-full h-auto p-6 flex flex-col justify-start items-end gap-4 rounded-2xl ${
            darkMode ? "bg-[#1A1D1F]" : "bg-white"
          }`}
        >
          <h2 className="w-full text-right text-xl font-bold">درباره پاژ</h2>
          <div className="w-full h-fit flex flex-col justify-start items-end gap-4">
            <p className="text-justify text-lg leading-8" dir="rtl">
              پاژ الکترونیک پاسارگاد با پشتوانه 20 سال تجربه، کارآفرین نمونه در
              صنعت حفاظت الکترونیک می باشد، که استقرار سامانه های هوشمند تجمیع
              آلارم سرقت، بخصوص در بانک ها و شبکه های یکپارچه از فعالیت های
              ممتاز آن شناخته می شود.
            </p>
            <p className="text-justify text-lg leading-8" dir="rtl">
              پاژ یک شرکت دانش بنیان و مورد تأیید سازمان افتا می‌باشد که در
              تولیدات و طرح‌های کلان خود از امنیت سایبری، هوش مصنوعی، پدافند
              غیرعامل و حفاظت هوشمند در حوزه فناوری ارتباطات بهره گرفته است.
            </p>
            <p className="text-justify text-lg leading-8" dir="rtl">
              کنترل پنل تجمیع آلارم تحت شبکه و نرم افزارهای کاربردی مانتورینگ و
              UDL از محصولات برجسته ما می باشد.
            </p>
            <div className="w-full mt-4">
              <h3 className="text-right text-lg font-semibold pb-2 mb-2">
                افتخارات و دستاوردها:
              </h3>
              <ul className="list-disc pr-6 text-justify text-lg space-y-2 leading-8">
                <div className="w-full flex justify-end items-center gap-10">
                  <li className="mr-14 text-nowrap" dir="rtl">
                    گواهی نامه بین المللی
                    <span
                      style={{
                        direction: "ltr",
                        fontFamily: "monospace",
                      }}
                    >
                      {" "}
                      9001:2008 ISO
                    </span>{" "}
                    از موسسه TUV
                  </li>
                  <li dir="rtl">تندیس طلایی رهبری و مدیریت بنگاه های اقتصادی</li>
                </div>
                <div className="w-full flex justify-end items-center gap-10">
                  <li className="w-[40%] text-nowrap" dir="rtl">
                    گواهی نامه و نشان برتر مرغوبیت خدمات کشوری
                  </li>
                  <li dir="rtl">نشان عالی مدیریت خلاق در حوزه سیستم های امنیتی ایران</li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
