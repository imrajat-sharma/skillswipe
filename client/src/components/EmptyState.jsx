import React, { createElement } from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-gray-100">
        {createElement(Icon, { size: 32, className: "text-gray-600" })}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
