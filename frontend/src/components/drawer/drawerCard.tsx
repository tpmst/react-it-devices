import React, { ReactNode } from "react";

interface CardComponentProps {
  children?: ReactNode;
}

const DrawerCard: React.FC<CardComponentProps> = ({ children }) => {
  return (
    <div className="bg-transparent ml-4 mr-4 rounded-lg mt-1 hover:bg-[#dfddcd] dark:hover:bg-[#2a3a53]">
      {/* Children */}
      {children}
    </div>
  );
};

export default DrawerCard;
