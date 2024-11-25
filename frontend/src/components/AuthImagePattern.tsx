import React from "react";

interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

const AuthImagePattern: React.FC<AuthImagePatternProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex h-full items-center justify-center bg-base-200 px-12">
      <div className="max-w-sm text-center">
        <div className="grid grid-cols-3 gap-3 mb-8 mt-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 theme-text">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
