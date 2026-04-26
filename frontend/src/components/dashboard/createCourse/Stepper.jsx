import React from "react";

const Stepper = ({ step }) => {
  const steps = [
    "Course Information",
    "Course Builder",
    "Publish",
  ];

  return (
    <div className="flex items-center justify-between mb-10 relative">

      {/* LINE */}
      <div className="absolute top-4 left-0 w-full h-[2px] bg-richblack-700"></div>

      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = step >= stepNumber;

        return (
          <div
            key={index}
            className="flex flex-col items-center w-full z-10"
          >

            {/* CIRCLE */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
              ${
                isActive
                  ? "bg-yellow-300 text-black"
                  : "bg-richblack-700 text-white"
              }`}
            >
              {stepNumber}
            </div>

            {/* LABEL */}
            <p
              className={`mt-2 text-sm ${
                isActive ? "text-yellow-300" : "text-richblack-400"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;