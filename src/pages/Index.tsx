import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Phone, Shield, Car, Award, ArrowRight, Star, Users, MapPin, Clock, ThumbsUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-banner.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFiltersBar from "@/components/CarFiltersBar";
import { useCars, type CarFilters } from "@/hooks/useCars";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Shield, title: "Trusted Quality", desc: "Every car inspected and certified before sale" },
  { icon: Car, title: "Wide Selection", desc: "Hatchbacks, sedans, SUVs & more to choose from" },
  { icon: Award, title: "Best Prices", desc: "Honest pricing with no hidden costs ever" },
];

const stats = [
  { value: "500+", label: "Cars Sold" },
  { value: "10+", label: "Years Experience" },
  { value: "100%", label: "Documentation Support" },
  { value: "4.8★", label: "Customer Rating" },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    car: "Maruti Swift",
    text: "Excellent service! Bought a Swift from Ashok Reddy Cars and the entire process was smooth. Transparent pricing and all paperwork was handled perfectly.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    car: "Hyundai Creta",
    text: "Very trustworthy dealer. The car condition was exactly as described. Highly recommend for anyone looking for a quality pre-owned car in Hyderabad.",
    rating: 5,
  },
  {
    name: "Venkat Reddy",
    car: "Honda City",
    text: "Best experience buying a used car. Fair prices, no pressure, and complete RTO transfer assistance. Will definitely come back for my next car!",
    rating: 5,
  },
];

const services = [
  { icon: ThumbsUp, title: "Quality Inspection", desc: "Every vehicle undergoes a thorough multi-point inspection" },
  { icon: Shield, title: "Complete Documentation", desc: "Full RTO transfer and insurance assistance included" },
  { icon: Clock, title: "Quick Process", desc: "Same-day documentation and hassle-free ownership transfer" },
  { icon: Users, title: "After-Sale Support", desc: "We stay connected even after the sale for any assistance" },
];

const Index = () => {
  const [filters, setFilters] = useState<CarFilters>({});
  const { data: cars, isLoading } = useCars(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Ashok Reddy Cars showroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-5xl font-bold text-foreground md:text-7xl"
          >
            Ashok Reddy <span className="text-gradient">Cars</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            Trusted Cars. Honest Deals. — Hyderabad's Favorite Pre-Owned Car Destination
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a href="tel:+919000771660">
              <Button size="lg" className="hero-gradient text-primary-foreground font-semibold text-base">
                <Phone className="mr-2 h-5 w-5" /> Call: 9000 771 660
              </Button>
            </a>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl hero-gradient flex-shrink-0">
                <h.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl hero-gradient p-8 md:p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/80">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Our <span className="text-gradient">Car Collection</span>
          </h2>
          <p className="mt-2 text-muted-foreground">Browse our handpicked selection of quality pre-owned cars</p>
        </div>

        <CarFiltersBar filters={filters} onChange={setFilters} />

        {isLoading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">No cars available yet</p>
            <p className="text-sm text-muted-foreground">Check back soon for new listings!</p>
          </div>
        )}
      </section>

      {/* Services */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              What <span className="text-gradient">We Offer</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Complete car buying experience from start to finish</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:shadow-glow hover:border-primary/30 transition-all duration-300"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl hero-gradient">
                  <s.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="mt-2 text-muted-foreground">Don't just take our word for it — hear from our happy customers</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed italic">"{t.text}"</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">Bought: {t.car}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Visit Our <span className="text-gradient">Showroom</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Come visit us at our showroom in Kukatpally, Hyderabad. We're conveniently located and happy to show you our full collection of quality pre-owned cars.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">Nandhu Nandhini Building, Mahankali Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+919000771660" className="text-sm text-foreground font-semibold hover:text-primary transition-colors">9000 771 660</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground">Mon – Sat: 9:00 AM – 8:00 PM</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="tel:+919000771660">
                  <Button className="hero-gradient text-primary-foreground font-semibold">
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                  </Button>
                </a>
                <a href="https://wa.me/919000771660" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0795988090067!2d78.40519599999999!3d17.503713299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910263c39411%3A0x47305d0373141a0d!2sAshok%20Reddy%20Cars!5e0!3m2!1sen!2sin!4v1771041881594!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ashok Reddy Cars location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Find Your Dream Car?
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            Visit our showroom in Kukatpally, Hyderabad or give us a call. We're here to help you find the perfect car.
          </p>
          <p className="mt-4 font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
            📞 9000 771 660
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+919000771660">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base">
                <Phone className="mr-2 h-5 w-5" /> Call Now
              </Button>
            </a>
            <Link to="/contact">
              <Button size="lg" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold text-base">
                Contact Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
