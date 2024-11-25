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
    <div className="flex items-center justify-between bg-gray-900 text-gray-100 px-6 py-4 shadow-md">
      {/* Logo Section */}
      <Link to="/" className="flex items-center">
        <MessagesSquare className="w-6 h-6 text-purple-400 mr-2" />
        <span className="text-xl font-bold text-yellow-500 hover:cursor-pointer">
          Chatty
        </span>
      </Link>

      {/* Right Section: Settings, Profile, Logout */}
      {authUser ? (
        <div className="flex items-center space-x-6">
          {/* Settings */}
          <Link
            className="flex items-center text-gray-300 hover:text-yellow-400"
            to="/settings"
          >
            <Settings className="w-5 h-5 mr-1" />
            <span className="hidden md:block">Settings</span>
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className="flex items-center text-gray-300 hover:text-yellow-400"
          >
            <User className="w-5 h-5 mr-1" />
            <span className="hidden md:block">Profile</span>
          </Link>

          {/* Logout */}
          <button
            className="flex items-center text-gray-300 hover:text-yellow-400"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-1" />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-yellow-500 hover:underline">
          Login
        </Link>
      )}
    </div>
  );
}

export default Navbar;
