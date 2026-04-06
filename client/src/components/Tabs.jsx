import React, { useState } from "react";
import clsx from "clsx";

export const Tabs = ({ tabs, defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div className="w-full">
      {/* Tab list */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(({ label, icon: Icon }, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={clsx(
              "flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 -mb-px",
              activeTab === index
                ? "text-primary-600 border-primary-600"
                : "text-gray-600 border-transparent hover:text-gray-900",
            )}
          >
            {Icon && <Icon size={18} />}
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{tabs[activeTab]?.content}</div>
    </div>
  );
};
