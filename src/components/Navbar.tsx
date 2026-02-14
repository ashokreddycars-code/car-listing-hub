import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ashok Reddy Cars" className="h-10 w-auto rounded" />
          <span className="font-heading text-lg font-bold text-foreground hidden sm:inline">
            Ashok Reddy <span className="text-primary">Cars</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button size="sm" variant="outline">
                Dashboard
              </Button>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={signOut} className="text-muted-foreground">
              Sign Out
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm" className="hero-gradient text-primary-foreground font-semibold">
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
