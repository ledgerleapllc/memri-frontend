import React from "react";

export default function Banner({ children }) {
  return (
    <div className="flex bg-secondary text-white justify-between items-center py-2.5 px-6" data-aos="fade-up" data-aos-duration="800">
      {children}
    </div>
  );
}
