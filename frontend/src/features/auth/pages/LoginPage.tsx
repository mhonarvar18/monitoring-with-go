import LoginForm from "../components/LoginForm";
import iranFlag from "../../../assets/images/iran.svg";
import PazhLogo from "../../../assets/images/Pazh.svg";
import SepehLoginImage from "../../../assets/images/sepah_login.png";
import KeshLoginImage from "../../../assets/images/tehran.jfif";
import IranZaminLoginImage from "../../../assets/images/iranzamin_login.jpg";
import LoginFormImage from "../../../assets/images/ba_login.png";
import FooterLogin from "../../../components/FooterLogin/FooterSepehLogin";
import FooterKeshLogin from "../../../components/FooterLogin/FooterKeshLogin";
import FooterIranZaminLogin from "../../../components/FooterLogin/FooterIranZamin";

interface LoginPageProps {
  dynamicRoute?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ dynamicRoute }) => {

  let backgroundImage = SepehLoginImage; 
  if (dynamicRoute === "keshavarzi") {
    backgroundImage = KeshLoginImage; 
  } else if (dynamicRoute === "iranZamin") {
    backgroundImage = IranZaminLoginImage; 
  }
    
  return (
    <div className="flex h-screen rtl">
      {/* Left: Image */}
      <div
        className="w-[55%] bg-cover bg-center relative flex justify-center items-end"
        style={{
          background: `url(${backgroundImage}) #d3d3d3 50% / cover no-repeat`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          className="w-1/3 z-10 fixed bottom-2 flex flex-col items-end gap-2 py-4 px-2 rounded-[15px] text-white text-right font-medium text-sm font-[iransans]"
          style={{
            background: "rgba(0, 0, 0, 0.40)",
            backdropFilter: "blur(3px)",
          }}
        >
          <p style={{ direction: "rtl" }}>
            1. رمز عبور خود را در فواصل زمانی کوتاه تغییر دهید.
          </p>
          <p style={{ direction: "rtl" }}>
            2. پس از انجام و اتمام کار، حتما از سیستم خارج شوید.
          </p>
          <p style={{ direction: "rtl" }}>
            3. هرگز نام کاربری و گذرواژه خود را در اختیار دیگران قرار ندهید.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div
        className="rtl w-[45%] h-full flex flex-col justify-start items-end  bg-white"
        style={{ backgroundImage: `url(${LoginFormImage})` }}
      >
        <img src={iranFlag} className="w-[16vw]" alt="Iran Flag" />
        <div className="w-full flex flex-col justify-between items-end font-[iransans] px-[14%]">
          <img src={PazhLogo} className="w-[13vw] mb-2" alt="Logo" />
          <h2 className="w-full text-right text-2xl mb-4 text-gray-700 font-bold">
            سامانه هوشمند پاژونیک
          </h2>
          <LoginForm dynamicRoute={dynamicRoute} />
          <div className="flex justify-content-center items-center fixed bottom-2 right-[8vw]">
            {dynamicRoute === "sepah" ? (
              <FooterLogin />
            ) : dynamicRoute === "keshavarzi" ? (
              <>
                <FooterKeshLogin />
              </>
            ) : (
              <>
                <FooterIranZaminLogin />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
