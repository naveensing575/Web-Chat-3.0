import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Signup from "./pages/SignUp";
import Signin from "./pages/SignIn";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );

  return (
    <Router>
      <div className="flex flex-col h-screen" data-theme={theme}>
        {/* Toaster for Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/sign-in" />}
          />
          <Route
            path="/sign-up"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/sign-in"
            element={!authUser ? <Signin /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/sign-in" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
