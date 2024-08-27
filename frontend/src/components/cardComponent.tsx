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
    <div className="bg-gray-200 rounded-lg shadow-lg p-6 inline-block">
      {" "}
      {/* Changed to inline-block */}
      {title && (
        <div className="bg-gray-300 rounded-t-lg p-4 mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}
      <div className="bg-white rounded-lg p-4">
        {content && <p className="mb-4">{content}</p>}
        {children}
      </div>
    </div>
  );
};

export default CardComponent;
