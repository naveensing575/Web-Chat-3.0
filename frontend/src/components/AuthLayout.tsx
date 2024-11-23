import { MessagesSquare, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface InputField {
  name: string;
  type: string;
  placeholder: string;
  Icon: React.ComponentType<any>;
  showToggle?: boolean;
}

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  fields: InputField[];
  submitText: string;
  footerText: string;
  footerLink: { text: string; path: string };
  submitHandler: (formData: FormData) => void;
  isLoading: boolean;
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
}: AuthLayoutProps) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = formData || new FormData();
    updatedFormData.set(e.target.name, e.target.value);
    setFormData(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) submitHandler(formData);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-100">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-800 px-10 py-6 shadow-lg">
        {/* Top Message Icon */}
        <div className="flex flex-col items-center mb-6">
          <MessagesSquare className="w-10 h-10 text-purple-500 mb-3" />
          <h2 className="text-3xl font-semibold text-yellow-400">{title}</h2>
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
                    className="input input-bordered w-full bg-gray-700 border-gray-600 text-gray-100 pl-8 pr-10"
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
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-700">
        <div className="grid grid-cols-3 gap-4 w-3/4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-yellow-500 rounded-lg opacity-70 hover:opacity-100 transition duration-300"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
