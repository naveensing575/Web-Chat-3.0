import { Settings, LogOut, User, MessagesSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

function Navbar() {
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-between bg-base-100 text-base-content px-6 py-4 shadow-md">
      {/* Logo Section */}
      <Link to="/" className="flex items-center">
        <MessagesSquare className="w-6 h-6 text-primary mr-2" />
        <span className="text-xl font-bold text-secondary hover:cursor-pointer">
          Chatty
        </span>
      </Link>

      {/* Navigation Section */}
      <div className="flex items-center space-x-6">
        {/* Settings: Always Visible */}
        <Link
          className="flex items-center text-base-content hover:text-accent"
          to="/settings"
        >
          <Settings className="w-5 h-5 mr-1" />
          <span className="hidden md:block">Settings</span>
        </Link>

        {/* Profile and Logout: Visible Only for Logged-in Users */}
        {authUser && (
          <>
            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center text-base-content hover:text-accent"
            >
              <User className="w-5 h-5 mr-1" />
              <span className="hidden md:block">Profile</span>
            </Link>

            {/* Logout */}
            <button
              className="flex items-center text-base-content hover:text-error"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-1" />
              <span className="hidden md:block">Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
