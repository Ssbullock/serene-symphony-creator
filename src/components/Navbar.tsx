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
    <>
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
            <button 
              className="block md:hidden text-foreground p-2 rounded-md hover:bg-gray-100" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Separate from nav */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
          <div className="fixed top-[65px] inset-x-0 bg-white border-b shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
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
                <div className="flex flex-col space-y-3 pt-4 border-t">
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
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
