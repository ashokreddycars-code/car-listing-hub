import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/sell", label: "Sell Car" },
  { to: "/compare", label: "Compare" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ashok Reddy Cars" className="h-10 w-auto rounded" />
          <span className="font-heading text-lg font-bold text-foreground hidden sm:inline">
            Ashok Reddy <span className="text-primary">Cars</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${location.pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:+919000771660" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Phone className="h-4 w-4" /> 9000 771 660
          </a>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isAdmin && (
            <Link to="/admin">
              <Button size="sm" variant="outline">Dashboard</Button>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={signOut} className="text-muted-foreground">Sign Out</Button>
          ) : (
            <Link to="/login">
              <Button size="sm" className="hero-gradient text-primary-foreground font-semibold">Admin Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium ${location.pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:+919000771660" className="flex items-center gap-1 py-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" /> 9000 771 660
          </a>
          <button onClick={toggleTheme} className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}>
              <Button size="sm" variant="outline" className="w-full">Dashboard</Button>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={signOut} className="w-full text-muted-foreground">Sign Out</Button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full hero-gradient text-primary-foreground font-semibold">Admin Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
