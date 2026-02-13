import { Link } from "react-router-dom";
import { Car, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-7 w-7 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">
            Auto<span className="text-primary">Hub</span>
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
