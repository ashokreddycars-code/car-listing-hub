import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const contactInfo = [
  { icon: Phone, title: "Phone", value: "9000 771 660", desc: "Call us anytime during working hours", href: "tel:+919000771660" },
  { icon: MessageCircle, title: "WhatsApp", value: "Chat with us instantly", desc: "Quick responses on WhatsApp", href: "https://wa.me/919000771660?text=Hi%2C%20I%27m%20interested%20in%20a%20car%20at%20Ashok%20Reddy%20Cars." },
  { icon: MapPin, title: "Address", value: "Nandhu Nandhini Building, Mahankali Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072", desc: "Visit our showroom", href: undefined },
  { icon: Clock, title: "Working Hours", value: "Mon – Sat: 9:00 AM – 8:00 PM", desc: "Sunday: By appointment only", href: undefined },
];

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="relative pt-24 pb-16">
      <div className="absolute inset-0 hero-gradient opacity-5" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl font-bold text-foreground md:text-5xl"
        >
          Contact <span className="text-gradient">Us</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground"
        >
          We'd love to hear from you! Reach out to us for any enquiries about our cars.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 font-heading text-2xl font-bold text-primary"
        >
          📞 9000 771 660
        </motion.p>
      </div>
    </section>

    <section className="container mx-auto px-4 pb-16">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Cards */}
        <div className="space-y-4">
          {contactInfo.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl hero-gradient flex-shrink-0">
                <c.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{c.title}</h3>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-medium hover:underline">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-sm text-foreground">{c.value}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
              </div>
            </motion.div>
          ))}

          <div className="flex gap-3 pt-4">
            <a href="tel:+919000771660" className="flex-1">
              <Button className="w-full hero-gradient text-primary-foreground font-semibold" size="lg">
                <Phone className="mr-2 h-4 w-4" /> Call Now
              </Button>
            </a>
            <a href="https://wa.me/919000771660" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" size="lg">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-card border border-border min-h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0795988090067!2d78.40519599999999!3d17.503713299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910263c39411%3A0x47305d0373141a0d!2sAshok%20Reddy%20Cars!5e0!3m2!1sen!2sin!4v1771041881594!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 500 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ashok Reddy Cars location"
          />
        </div>
      </div>
    </section>

    {/* Browse CTA */}
    <section className="hero-gradient py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
          Looking for a Car?
        </h2>
        <p className="mt-2 text-primary-foreground/80">Browse our collection of quality pre-owned cars</p>
        <Link to="/">
          <Button size="lg" className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
            Browse Cars <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default Contact;
