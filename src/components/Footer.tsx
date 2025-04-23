
import { Link } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full p-4 text-center text-white/70 text-sm mt-auto">
      <div className="flex items-center justify-center gap-1">
        <span>Made by</span>
        <a 
          href="http://visheshsanghvi.me/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-bollywood-gold hover:text-bollywood-gold/80 transition-colors"
        >
          Vishesh Sanghvi
          <Link className="h-3 w-3" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
