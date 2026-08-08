import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("userName", form.userName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("profileImage", profileImage);

    try {
      const response = await signupUser(formData);

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-6">
      <div className="w-full max-w-md bg-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-xl text-white">

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="userName"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="w-full flex flex-col items-center">

            <label className="text-sm text-gray-300 mb-2">
              Upload Profile Picture
            </label>

            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition">

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400 text-xs px-2">
                  Click to upload
                  <br />
                  Profile Photo
                </div>
              )}

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
          >
            Signup
          </button>

        </form>

        <p className="text-center text-gray-400 mt-4 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;