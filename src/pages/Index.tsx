import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Phone, Shield, Car, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-banner.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFiltersBar from "@/components/CarFiltersBar";
import { useCars, type CarFilters } from "@/hooks/useCars";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Shield, title: "Trusted Quality", desc: "Every car inspected and certified" },
  { icon: Car, title: "Wide Selection", desc: "Hatchbacks, sedans, SUVs & more" },
  { icon: Award, title: "Best Prices", desc: "Honest pricing, no hidden costs" },
];

const Index = () => {
  const [filters, setFilters] = useState<CarFilters>({});
  const { data: cars, isLoading } = useCars(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex h-[75vh] items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury cars showroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative z-10 text-center px-4">
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
              <Button size="lg" className="hero-gradient text-primary-foreground font-semibold">
                <Phone className="mr-2 h-5 w-5" /> Call Now
              </Button>
            </a>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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

      {/* Listings */}
      <section className="container mx-auto px-4 py-16">
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

      {/* CTA */}
      <section className="hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Find Your Dream Car?
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            Visit our showroom in Kukatpally, Hyderabad or give us a call. We're here to help you find the perfect car.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+919000771660">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Phone className="mr-2 h-5 w-5" /> 9000 771 660
              </Button>
            </a>
            <Link to="/contact">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                Contact Us
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
