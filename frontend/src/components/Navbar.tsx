import { Settings } from "lucide-react";
function Navbar() {
  return (
    <div className="flex items-center justify-between bg-gray-900 text-gray-100">
      {/* Logo */}
      <div className="flex items-center p-4 ">
        <span className="text-2xl font-bold text-yellow-500 hover: cursor-pointer">
          Chatter
        </span>
      </div>
      {/* Settings */}
      <div className="flex items-center p-4 hover: cursor-pointer">
        <Settings className="w-6 h-6" />
      </div>
    </div>
  );
}

export default Navbar;
