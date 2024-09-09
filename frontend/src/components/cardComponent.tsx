import React, { ReactNode } from "react";

interface CardComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({
  title,
  content,
  children,
}) => {
  return (
    <div className="bg-[#525761] border-[#4a5468] rounded-lg shadow-lg p-6 inline-block">
      {" "}
      {/* Changed to inline-block */}
      {title && (
        <div className="border rounded-t-lg p-4 mb-4">
          <h2 className="text-lg text-white font-semibold">{title}</h2>
        </div>
      )}
      <div className="rounded-lg text-white p-4">
        {content && <p className="mb-4">{content}</p>}
        {children}
      </div>
    </div>
  );
};

export default CardComponent;
