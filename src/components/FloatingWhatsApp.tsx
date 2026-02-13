import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const FloatingWhatsApp = () => {
  const phoneNumber = "919999999999"; // Replace with actual phone number
  const message = "Hi, I'm interested in your car listings. Can you help?";

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full hero-gradient shadow-glow transition-all duration-300 hover:shadow-lg"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-primary-foreground" />
    </motion.button>
  );
};

export default FloatingWhatsApp;
