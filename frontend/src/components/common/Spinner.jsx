import React from "react";

const Spinner = ({ size = 40 }) => {
  return (
    <div className="flex justify-center items-center w-full h-full mb-50">
      <div
        style={{ width: size, height: size }}
        className="border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Spinner;