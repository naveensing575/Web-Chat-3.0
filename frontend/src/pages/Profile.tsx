import { useEffect, ChangeEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, checkAuth, updateProfilePic } =
    useAuthStore();

  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, [authUser, checkAuth]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateProfilePic(file);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen pt-20 text-gray-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-gray-800 rounded-xl p-6 space-y-8 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-yellow-400">Profile</h1>
            <p className="mt-2 text-gray-400">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {authUser.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                />
              ) : (
                <User className="w-32 h-32 text-gray-500 border-4 border-gray-700 rounded-full p-4" />
              )}
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full cursor-pointer transition-transform duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-gray-900" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600">
                {authUser.fullName || "Not provided"}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600">
                {authUser.email || "Not provided"}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-medium text-yellow-400 mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
