
import { Link } from "react-router-dom";
import { Github, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-meditation-tranquil py-12 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-meditation-calm-blue"></div>
              <span className="text-xl font-medium text-foreground">Serene</span>
            </Link>
            <p className="mt-4 text-sm text-foreground/70">
              AI-powered meditations crafted for your unique needs, delivering personalized tranquility at your fingertips.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-4">App</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="#features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/70">&copy; {currentYear} Serene. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition-colors">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition-colors">
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
