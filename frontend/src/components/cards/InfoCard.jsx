import React from "react";

const InfoCard = ({ label, value, color }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-2 md:w-3 h-3 md:h-5 rounded-full ${color}`}
        style={{ width: "0.5rem", height: "0.5rem" }}
      ></div>
      <p className="text-sm md:text-base text-gray-500">
        <span className="text-sm md:text-base text-black font-semibold">
          {value}
        </span>{" "}
        {label}
      </p>
    </div>
  );
};

export default InfoCard;
