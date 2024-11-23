import AuthLayout from "../components/AuthLayout";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock } from "lucide-react";
import { axiosInstance } from "../services/axios";

const SignIn = () => {
  const { isLoginingIn } = useAuthStore();

  const handleSignIn = async (formData: FormData) => {
    try {
      useAuthStore.setState({ isLoginingIn: true });
      const res = await axiosInstance.post("/auth/signin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("SignIn successful: ", res.data);
    } catch (error) {
      console.error("SignIn error: ", error);
    } finally {
      useAuthStore.setState({ isLoginingIn: false });
    }
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
    />
  );
};

export default SignIn;
