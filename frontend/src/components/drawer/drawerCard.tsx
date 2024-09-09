import React, { ReactNode } from "react";

interface CardComponentProps {
  children?: ReactNode;
}

const DrawerCard: React.FC<CardComponentProps> = ({ children }) => {
  return (
    <div className="bg-white border ml-4 mr-4 rounded-lg mt-1 ">
      {/* Children */}
      {children}
    </div>
  );
};

export default DrawerCard;
