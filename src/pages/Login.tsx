import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.jpeg";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({ title: "Account created! You are now the admin." });
      } else {
        await signIn(email, password);
      }
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 text-center">
          <img src={logo} alt="Ashok Reddy Cars" className="mx-auto h-14 w-auto rounded" />
          <h1 className="mt-3 font-heading text-2xl font-bold text-foreground">
            {isSignUp ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp ? "First signup becomes admin" : "Sign in to manage listings"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 bg-muted" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1 bg-muted" />
          </div>
          <Button type="submit" disabled={loading} className="w-full hero-gradient text-primary-foreground font-semibold">
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 block w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {isSignUp ? "Already have an account? Sign in" : "First time? Create admin account"}
        </button>
      </div>
    </div>
  );
};

export default Login;
