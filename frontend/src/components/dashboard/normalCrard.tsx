import React, { ReactNode } from "react";

interface CardComponentProps {
  children?: ReactNode;
  title?: string;
}

const NormalCard: React.FC<CardComponentProps> = ({ children, title }) => {
  return (
    <div>
      <h1 className="text-2xl text-black dark:text-white mt-4">{title}</h1>
      <div className="bg-white dark:bg-[#171c24] border text-white p-2 mt-1 rounded-lg inline-block shadow-md">
        {/* Cildren */}
        {children}
      </div>
    </div>
  );
};

export default NormalCard;
