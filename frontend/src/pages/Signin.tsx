import AuthLayout from "../components/AuthLayout";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock } from "lucide-react";

const SignIn = () => {
  const { isLoginingIn, signIn } = useAuthStore();

  const handleSignIn = async (formData: Record<string, string>) => {
    await signIn(formData);
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Sign in to your account"
      fields={[
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
      submitText="Sign In"
      footerText="Don’t have an account?"
      footerLink={{ text: "Create Account", path: "/sign-up" }}
      submitHandler={handleSignIn}
      isLoading={isLoginingIn}
      rightPanelProps={{
        title: "Welcome back!",
        subtitle:
          "Sign in to continue your conversations and catch up with your messages.",
      }}
    />
  );
};

export default SignIn;
