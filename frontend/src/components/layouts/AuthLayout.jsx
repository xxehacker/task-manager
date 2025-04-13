import React from "react";
import BG_IMAGE from "../../assets/login.svg";

function AuthLayout({ children }) {
  return (
    <div className="flex ">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      <div className="hidden md:flex w-[40vw] items-center justify-center bg-slate-950
        bg-[url('')] bg-cover bg-no-repeat bg-center
     overflow-hidden p-8 "
      >
        <img src={BG_IMAGE} alt="BG_IMAGE" className="w-64 lg:w-[90%]" />
      </div>
    </div>
  );
}

export default AuthLayout;
