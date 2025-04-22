import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import AXIOS_INSTANCE from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  // const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  // handle login form submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);

    if (!email || !password) {
      setError("Please fillup all the fields ...");
      return;
    }

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
      const response = await AXIOS_INSTANCE.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (!response.data?.user) {
        console.log("Login failed");
      }
      // global state - userContext
      setUser(response.data?.user);

      alert(response.data?.message); // toast mesage
      if (response.data?.user?.role || response.data?.user?.role === "admin") {
        navigate("/admin/dashboard");
      }

      if (response.data?.user?.role || response.data?.user?.role === "member") {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.log("Login error: ", error?.message);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px]s mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLoginSubmit}>
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

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button className="btn-primary" type="submit">
            Login
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account ?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
