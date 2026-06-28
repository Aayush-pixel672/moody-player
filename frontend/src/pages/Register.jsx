import { Link } from "react-router-dom";

const Register = () => {

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 w-[450px]">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">

          Register

        </h1>

        <form className="space-y-5">

          <input
            type="text"
            placeholder="Enter Name"
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full p-4 rounded-xl bg-zinc-800 text-white outline-none"
          />

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-semibold text-white transition"
          >

            Register

          </button>

        </form>

        <p className="text-zinc-400 text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-purple-500"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );
};

export default Register;