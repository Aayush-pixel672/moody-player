import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/auth/login", {

        email,
        password,

      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful ✅");

      navigate("/");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 w-[450px]">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">

          Login

        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-semibold text-white transition"
          >

            Login

          </button>

        </form>

        <p className="text-zinc-400 text-center mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-purple-500"
          >

            Register

          </Link>

        </p>

      </div>

    </div>

  );
};

export default Login;