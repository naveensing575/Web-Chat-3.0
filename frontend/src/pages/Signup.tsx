import AuthLayout from "../components/AuthLayout";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Lock } from "lucide-react";

const Signup = () => {
  const { isSingingUp, signUp } = useAuthStore();

  const handleSignup = async (formData: Record<string, string>) => {
    await signUp(formData);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Get started with your free account"
      fields={[
        { name: "fullName", type: "text", placeholder: "John Doe", Icon: User },
        {
          name: "email",
          type: "email",
          placeholder: "you@example.com",
          Icon: Mail,
        },
        {
          name: "password",
          type: "password",
          placeholder: "********",
          Icon: Lock,
          showToggle: true,
        },
      ]}
      submitText="Create Account"
      footerText="Already have an account?"
      footerLink={{ text: "Sign In", path: "/sign-in" }}
      submitHandler={handleSignup}
      isLoading={isSingingUp}
      rightPanelProps={{
        title: "Join our community",
        subtitle:
          "Connect with friends, share moments, and stay in touch with your loved ones.",
      }}
    />
  );
};

export default Signup;
