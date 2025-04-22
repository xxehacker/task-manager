import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { Link, useNavigate } from "react-router-dom";
import AXIOS_INSTANCE from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPath";
import { uploadImage } from "../../utils/uploadImage";

function Signup() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [adminInviteToken, setAdminInviteToken] = React.useState("");
  const [profilePic, setProfilePic] = React.useState("");

  const [error, setError] = React.useState(null);
  // const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError("Username , Email  & Password are required");
      return;
    }

    let profileImageURL = "";

    if (!validateEmail(email)) {
      setError("Please enter a valid email ...");
      return;
    }

    if (password.length < 6) {
      setError("Password much be greater than 6");
      return;
    }

    setError(null);

    // login api call
    try {
      // image upload
      if (profilePic) {
        const imageUploadResponse = await uploadImage(profilePic);
        console.log(imageUploadResponse);
        profileImageURL = imageUploadResponse.profileImageURL | "";
        console.log("profileImageURL", profileImageURL); //! output : 0 ?
      }
      const response = await AXIOS_INSTANCE.post(API_ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password,
        profileImageURL,
        adminInviteToken,
      });

      if (!response.data?.user) {
        console.log("Registration failed");
      }
      console.log(response.data?.user);

      alert(response.data?.message); // toast message
      if (response.data?.user) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Login error: ", error?.message);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-4xl font-semibold text-black">Crate an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below ...
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Example"
              label="Username"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              label="Email Address"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Example@123"
              label="Password"
            />
            <Input
              type="text"
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              placeholder="12345"
              label="Admin Invite Token"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button className="btn-primary" type="submit">
            SignUp
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already an account ?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
