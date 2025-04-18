import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

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

    setLoading(true);
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
          </p>
          <Link className="font-medium text-primary underline" to="/signup">
            Signup
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
