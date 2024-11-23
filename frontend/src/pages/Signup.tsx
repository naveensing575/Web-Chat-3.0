import AuthLayout from "../components/AuthLayout";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Lock } from "lucide-react";
import { axiosInstance } from "../services/axios";

const Signup = () => {
  const { isSingingUp } = useAuthStore();

  const handleSignup = async (formData: FormData) => {
    try {
      useAuthStore.setState({ isSingingUp: true });
      const res = await axiosInstance.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Signup successful: ", res.data);
    } catch (error) {
      console.error("Signup error: ", error);
    } finally {
      useAuthStore.setState({ isSingingUp: false });
    }
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
    />
  );
};

export default Signup;
