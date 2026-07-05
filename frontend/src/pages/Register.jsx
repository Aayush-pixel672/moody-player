import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";

import api from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration Successful 🎉");

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-5 overflow-hidden">
      {/* Background Glow */}

      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full -top-32 -left-32" />

      <div className="absolute w-[450px] h-[450px] bg-pink-500/20 blur-[140px] rounded-full bottom-0 right-0" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative z-10 w-full max-w-[500px] p-10 backdrop-blur-xl">
          <p className="text-purple-400 text-center font-semibold tracking-[0.25em] uppercase mb-2">
            Join Moody Player
          </p>

          <h1 className="text-4xl font-extrabold text-white text-center">
            Create Account
          </h1>

          <p className="text-zinc-400 text-center mt-4 mb-8 leading-7">
            Create your account and start discovering music based on your mood.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />

                <Input
                  type="text"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Email */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />

                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Password */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-purple-400 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 py-3 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </Button>
            </motion.div>
          </form>
          <div className="mt-8 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-400">Already have an account?</p>

            <Link
              to="/login"
              className="inline-block mt-2 font-semibold text-purple-400 hover:text-pink-400 transition-all duration-300 hover:translate-x-1"
            >
              Login →
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
