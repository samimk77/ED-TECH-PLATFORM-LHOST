import React, { useState } from "react";
import Stepper from "./Stepper";
import CourseInformation from "./CourseInformation";
import CourseBuilder from "./CourseBuilder";
import PublishCourse from "./PublishCourse";

const AddCourse = () => {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);

  return (
    <div className="w-11/12 mx-auto text-white">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        Create New Course
      </h1>

      {/* STEPPER */}
      <Stepper step={step} />

      {/* STEPS */}
      {step === 1 && (
        <CourseInformation
          setStep={setStep}
          setCourseId={setCourseId}
        />
      )}

      {step === 2 && (
        <CourseBuilder
          setStep={setStep}
          courseId={courseId}
        />
      )}

      {step === 3 && (
        <PublishCourse
          setStep={setStep}
          courseId={courseId}
        />
      )}

    </div>
  );
};

export default AddCourse;