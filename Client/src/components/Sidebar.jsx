import { Show, useClerk, useUser } from "@clerk/react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", lable: "Dashboard", Icon: House },
  { to: "/ai/review-resume", lable: "Review Resume", Icon: FileText },
  { to: "/ai/write-article", lable: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", lable: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", lable: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", lable: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", lable: "Remove Object", Icon: Scissors },
  { to: "/ai/community", lable: "Community", Icon: Users },
];
const Sidebar = ({ Sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  //   if (!isLoaded || !user) return null;

  return (
    <div
      className={`w-60 bg-white  border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${Sidebar ? "translate-x-0" : "max-sm:translate-x-full"} transition-all duration-300 ease-in-out `}
    >
      <div className=" my-7 w-full ">
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center">{user.fullName}</h1>
        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, lable, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded 
              ${
                isActive
                  ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                  : ""
              }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  {lable}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img
            src={user.imageUrl}
            className="w-8 rounded-full"
            alt="user-img"
          />
          <div>
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              <Show when={{ plan: "premium" }} fallback={<span>Free</span>}>
                Premium
              </Show>{" "}
              Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-black transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
