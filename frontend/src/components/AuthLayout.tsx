import { MessagesSquare, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import AuthImagePattern from "./AuthImagePattern";

interface InputField {
  name: string;
  type: string;
  placeholder: string;
  Icon: React.ComponentType<any>;
  showToggle?: boolean;
  validation?: (value: string) => string | null;
}

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  fields: InputField[];
  submitText: string;
  footerText: string;
  footerLink: { text: string; path: string };
  submitHandler: (formData: Record<string, string>) => void;
  isLoading: boolean;
  rightPanelProps: { title: string; subtitle: string };
}

const AuthLayout = ({
  title,
  subtitle,
  fields,
  submitText,
  footerText,
  footerLink,
  submitHandler,
  isLoading,
  rightPanelProps,
}: AuthLayoutProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string): string | null => {
    const field = fields.find((field) => field.name === name);
    return field?.validation ? field.validation(value) : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate the field and store its error
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

    // Update form data
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Run validation for all fields
    const validationErrors: Record<string, string | null> = {};
    fields.forEach(({ name }) => {
      const error = validateField(name, formData[name] || "");
      validationErrors[name] = error;
    });

    setErrors(validationErrors);

    // Check if there are any errors before submitting
    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    submitHandler(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen bg-gray-900 text-gray-100">
      {/* Left Panel */}
      <div className="flex flex-col items-center justify-center bg-gray-800 px-10 py-6 shadow-lg">
        {/* Top Message Icon */}
        <div className="flex flex-col items-center mb-6">
          <MessagesSquare className="w-10 h-10 text-purple-500 mb-3" />
          <h2 className="text-3xl font-semibold text-yellow-400 pb-2">
            {title}
          </h2>
          <p className="text-center text-gray-400">{subtitle}</p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="form-control relative" key={field.name}>
                <div className="relative">
                  <input
                    type={
                      field.showToggle
                        ? showPassword
                          ? "text"
                          : "password"
                        : field.type
                    }
                    name={field.name}
                    placeholder={field.placeholder}
                    className={`input input-bordered w-full bg-gray-700 border-gray-600 text-gray-100 pl-8 pr-10 ${
                      errors[field.name] ? "border-red-500" : ""
                    }`}
                    onChange={handleInputChange}
                  />
                  <field.Icon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  {field.showToggle && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:text-yellow-400 transition duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
                {errors[field.name] && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-warning w-full font-semibold`}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : submitText}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-gray-400 mt-4">
            {footerText}{" "}
            <Link
              to={footerLink.path}
              className="text-yellow-400 hover:underline"
            >
              {footerLink.text}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <AuthImagePattern {...rightPanelProps} />
    </div>
  );
};

export default AuthLayout;
