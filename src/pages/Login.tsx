
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { Loader2, LogIn as LogInIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, authState } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  if (authState.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-bollywood-dark to-bollywood-tertiary">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-bollywood-gold">Dialogues</span> Ka{" "}
            <span className="text-bollywood-accent">Jadoo</span>
          </h1>
          <p className="text-white/70">Login to continue</p>
        </div>
        <div className="bollywood-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bollywood-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bollywood-input"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs text-bollywood-accent underline focus:outline-none mt-1"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button 
              type="submit" 
              className="bollywood-primary-button w-full"
              disabled={authState.isLoading}
            >
              {authState.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogInIcon className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-bollywood-accent hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
