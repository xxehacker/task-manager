import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { SIDE_MENU_ITEMS, SIDE_MENU_USER_DATA } from "../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    //! pending - backend api call
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(isAdmin ? SIDE_MENU_ITEMS : SIDE_MENU_USER_DATA);
    }
  }, [user, isAdmin]);

  return (
    <aside className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 lg:flex flex-col justify-between hidden">
      <div>
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center mb-4 pt-5">
          <img
            src={user?.profileImageURL || ""}
            alt="Profile Image"
            className="w-20 h-20 rounded-full text-center flex justify-center items-center bg-green-400 object-cover"
          />
          <h5 className="text-gray-950 font-medium leading-5 mt-3">
            {user?.username || ""}
          </h5>
          <p className="text-sm text-gray-600">{user?.email || ""}</p>
        </div>

        {/* Admin Label */}
        {isAdmin && (
          <div className="text-xs font-medium text-white bg-primary px-3 py-1 rounded mt-2 mx-6">
            <h2 className="text-lg font-semibold text-black">
              Admin Dashboard
            </h2>
          </div>
        )}

        {/* Side Menu Items */}
        <nav className="mt-5">
          {sideMenuData.map((item, index) => (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-1 transition-colors rounded-md ${
                activeMenu === item.label
                  ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/40"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="text-xl" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;
