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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navbarClass = transparent && !scrolled && !isOpen 
    ? "bg-transparent" 
    : "bg-white bg-opacity-80 backdrop-blur-md shadow-sm";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            {/* Replace static circle with breathing animation logo */}
            <div className="relative h-8 w-8 mr-2">
              <div className="absolute inset-0 bg-meditation-calm-blue rounded-full animate-breathe opacity-20"></div>
              <div className="absolute inset-1 bg-meditation-calm-blue rounded-full animate-breathe opacity-40" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute inset-2 bg-meditation-calm-blue rounded-full animate-breathe opacity-60" style={{ animationDelay: "1s" }}></div>
              <div className="absolute inset-3 bg-meditation-calm-blue rounded-full animate-breathe opacity-80" style={{ animationDelay: "1.5s" }}></div>
            </div>
            <span className="text-xl font-medium text-foreground">Serene</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => scrollToSection('home')}
              className="nav-link text-foreground/80 hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="nav-link text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="nav-link text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <Link to="/auth?mode=login" className="btn-secondary">
              Login
            </Link>
            <Link to="/auth?mode=signup" className="btn-primary-gradient">
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
              <button 
                onClick={() => scrollToSection('home')}
                className="text-foreground/80 hover:text-foreground py-2 text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-foreground/80 hover:text-foreground py-2 text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-foreground/80 hover:text-foreground py-2 text-left"
              >
                Pricing
              </button>
              <div className="flex flex-col space-y-3 pt-2">
                <Link 
                  to="/auth?mode=login" 
                  className="btn-secondary w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth?mode=signup" 
                  className="btn-primary-gradient w-full justify-center"
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
