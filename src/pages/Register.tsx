
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { UserPlus, Loader } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, authState } = useAuthContext();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(email, username, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  if (authState.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8 animate-scale-in">
          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="text-bollywood-gold">Dialogues</span> Ka{" "}
            <span className="text-bollywood-accent">Jadoo</span>
          </h1>
          <p className="text-white/80 text-lg">Create your account today!</p>
        </div>
        <div className="bollywood-card p-8 shadow-2xl backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bollywood-input text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 text-sm">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="BollywoodFan123"
                required
                className="bollywood-input text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 text-sm">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bollywood-input text-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 text-sm">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bollywood-input text-black placeholder:text-gray-400"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs text-bollywood-accent hover:text-bollywood-secondary transition-colors focus:outline-none mt-1"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-sm animate-shake p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 bg-bollywood-gold hover:bg-bollywood-gold/90 text-black font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={authState.isLoading}
            >
              {authState.isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Register
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-bollywood-accent hover:text-bollywood-secondary transition-colors hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
