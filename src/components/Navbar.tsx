
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClass = transparent && !scrolled && !isOpen 
    ? "bg-transparent" 
    : "bg-white bg-opacity-80 backdrop-blur-md shadow-sm";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-meditation-calm-blue animate-pulse-soft"></div>
            <span className="text-xl font-medium text-foreground">Serene</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="nav-link text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="#how-it-works" className="nav-link text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="#pricing" className="nav-link text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/auth" className="btn-secondary">
              Login
            </Link>
            <Link to="/auth" className="btn-primary">
              Sign up
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              className="text-foreground p-2 rounded-md" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white animate-fade-in">
            <div className="flex flex-col space-y-4 py-4 px-4">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="#how-it-works" 
                className="text-foreground/80 hover:text-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="#pricing" 
                className="text-foreground/80 hover:text-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col space-y-3 pt-2">
                <Link 
                  to="/auth" 
                  className="btn-secondary w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth" 
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
