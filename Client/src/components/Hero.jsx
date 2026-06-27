import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser } from "@clerk/react";
import { FaLinkedin } from "react-icons/fa";
const Hero = () => {
  const logos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];
  // User
  const { user } = useUser();
  const { openSignIn } = useClerk();
  // Navigation
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6 mt-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create Amazing Content <br /> with{" "}
          <span className="text-primary">AI tools</span>
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
          Transform your content creation with our collection of premium AI
          tools. Write articles, generate images, and enhance your workflow.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
          <button
            onClick={() => (user ? navigate("/ai") : openSignIn())}
            className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"
          >
            Start creating now
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.linkedin.com/posts/sivabalan-mern-stackdeveloper_opentowork-fullstackdeveloper-reactjs-ugcPost-7476327747082964993-Y_N5/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAErm-oMB8I0bW3sfXpnKQYpsEJrEmhyj9MY",
                "_blank",
              )
            }
            className="flex items-center gap-2 bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer"
          >
            <a
              href="https://linkedin.com"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={24} color="#0077b5" />
            </a>
            Watch demo
          </button>
        </div>
        <div className="flex items-center gap-4 mt-8 justify-center text-gray-600">
          <img src={assets.user_group} alt="" className="h-8" />
          Trusted by 10k+ people
        </div>
      </div>
      <div className="relative overflow-hidden max-w-5xl mt-10 mx-auto">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10"></div>

        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

        <div className="flex items-center animate-marquee">
          {logos.concat(logos).map((logo, index) => (
            <img
              key={index}
              src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${logo}.svg`}
              alt={logo}
              className="h-8 mx-6 shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
