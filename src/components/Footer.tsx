import { Link } from "react-router-dom";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => (
  <footer className="border-t border-border bg-muted/30 py-12 text-muted-foreground">
    <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
      <div>
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ashok Reddy Cars" className="h-10 w-auto rounded" />
          <span className="font-heading text-lg font-bold text-foreground">
            Ashok Reddy <span className="text-primary">Cars</span>
          </span>
        </Link>
        <p className="mt-3 text-sm">Trusted Cars. Honest Deals.</p>
        <div className="mt-3 space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <a href="tel:+919000771660" className="hover:text-primary transition-colors">9000 771 660</a>
          </p>
          <p className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <a href="https://wa.me/919000771660" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Quick Links</h3>
        <nav className="space-y-2 text-sm">
          <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="block hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="block hover:text-primary transition-colors">Contact</Link>
        </nav>
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Visit Us</h3>
        <p className="text-sm flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          Nandhu Nandhini Building, Mahankali Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072
        </p>
        <div className="mt-4 rounded-lg overflow-hidden border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0795988090067!2d78.40519599999999!3d17.503713299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910263c39411%3A0x47305d0373141a0d!2sAshok%20Reddy%20Cars!5e0!3m2!1sen!2sin!4v1771041881594!5m2!1sen!2sin"
            width="100%"
            height="150"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ashok Reddy Cars location"
          />
        </div>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Ashok Reddy Cars. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
