import React from "react";
// Import your CSS file

const ProgressBar = ({ languages }) => {
  return (
    <div className="mb-2">
      <span className="Progress">
        {languages.map((lang, index) => (
          <span
            key={lang.language}
            style={{
              backgroundColor: lang.color,
              width: `${lang.percentage}%`,
            }}
            aria-label={`${lang.language} ${lang.percentage}`}
            className="Progress-item color-bg-success-emphasis"
          ></span>
        ))}
      </span>
    </div>
  );
};

export default ProgressBar;
