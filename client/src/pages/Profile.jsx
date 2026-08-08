import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "../services/userService";
import API from "../services/api";
import { updateProfileImage } from "../services/userService";

function Profile() {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.userName || "");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateProfile({ userName: name });

      await fetchUser();

      setEdit(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "chat-app");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drrd6akmz/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      await updateProfileImage(data.secure_url);

      await fetchUser();
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get("/contact");

        setChatCount(res.data?.data?.length || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-3 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 order-2 lg:order-1">

          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm mb-5 flex items-center justify-center gap-2"
          >
            <span>←</span> Back Home
          </button>

          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5">
            Account Overview
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between items-center gap-3 py-1.5 border-b border-white/5">
              <span className="text-gray-400 flex-shrink-0">Status</span>
              <span className="text-green-400 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
                Online
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 py-1.5 border-b border-white/5">
              <span className="text-gray-400 flex-shrink-0">Email</span>
              <span className="truncate text-right max-w-[150px] sm:max-w-[200px] md:max-w-[220px]">
                {user?.email}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 py-1.5">
              <span className="text-gray-400 flex-shrink-0">Role</span>
              <span className="bg-blue-500/20 px-3 py-0.5 rounded-full text-xs text-blue-300">
                User
              </span>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 lg:hidden">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
              <p className="text-gray-400 text-xs">Chats</p>
              <p className="text-lg font-bold">{chatCount}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
              <p className="text-gray-400 text-xs">Status</p>
              <p className={`font-bold ${user?.isOnline ? "text-green-400" : "text-red-400"}`}>
                {user?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

        </div>

        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col items-center order-1 lg:order-2">

          <div className="relative group cursor-pointer flex flex-col items-center">

            <div className="relative">
              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${user?.userName}&size=128`
                }
                alt="profile"
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg shadow-blue-500/20"
              />

              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <label className="mt-3 block text-center cursor-pointer text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors">
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Change Profile Picture"
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

          </div>

          {!edit ? (
            <h1 className="text-xl sm:text-2xl font-bold mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
              {name}
              <button
                onClick={() => setEdit(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 hover:bg-blue-500/10 rounded-lg"
              >
                ✏️ Edit
              </button>
            </h1>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-sm">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-center outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your name"
                autoFocus
              />
              <div className="flex flex-wrap justify-center gap-2 w-full">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 min-w-[80px] px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  onClick={() => {
                    setName(user?.userName);
                    setEdit(false);
                  }}
                  className="flex-1 min-w-[80px] px-4 py-2.5 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <p className="text-gray-400 mt-2 text-xs sm:text-sm break-all text-center px-2">
            {user?.email}
          </p>

          <div className="hidden lg:grid grid-cols-2 gap-4 mt-6 w-full">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Chats</p>
              <p className="text-2xl font-bold mt-1">{chatCount}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
              <p className={`text-xl font-bold mt-1 ${user?.isOnline ? "text-green-400" : "text-red-400"}`}>
                {user?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center mt-3 w-full hover:bg-white/10 transition-colors">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Member Since
            </p>
            <p className="text-sm font-semibold mt-1">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
                : "-"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 sm:mt-8 w-full max-w-xs py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;
