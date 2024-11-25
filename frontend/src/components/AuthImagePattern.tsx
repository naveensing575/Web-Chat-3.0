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
        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8 mt-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl ${
                i % 2 === 0 ? "bg-primary animate-pulse" : "bg-accent"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-secondary mb-4">{title}</h2>

        {/* Subtitle */}
        <p className="text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
