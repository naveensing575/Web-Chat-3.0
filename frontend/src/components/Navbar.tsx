import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function Navbar() {
  const { authUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-900 text-gray-100">
      {/* Logo */}
      <div className="flex items-center p-4">
        <span className="text-2xl font-bold text-yellow-500 hover:cursor-pointer">
          Chatter
        </span>
      </div>

      {/* Settings */}
      <div className="relative">
        <div
          className="flex items-center p-4 hover:cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Settings className="w-6 h-6" />
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg z-999">
            <ul className="py-1 text-sm text-gray-300">
              {authUser && (
                <li
                  className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="inline w-4 h-4 mr-2" />
                  Logout
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
