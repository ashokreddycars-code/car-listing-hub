import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Phone } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import CarFiltersBar from "@/components/CarFiltersBar";
import { useCars, type CarFilters } from "@/hooks/useCars";

const Index = () => {
  const [filters, setFilters] = useState<CarFilters>({});
  const { data: cars, isLoading } = useCars(filters);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex h-[70vh] items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury cars showroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
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
            Trusted Cars. Honest Deals.
          </motion.p>
        </div>
      </section>

      {/* Listings */}
      <section className="container mx-auto px-4 py-12">
        <CarFiltersBar filters={filters} onChange={setFilters} />

        {isLoading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-secondary" />
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

      {/* Footer */}
      <footer className="border-t border-border py-12 text-muted-foreground">
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Ashok Reddy Cars</h3>
            <p className="text-sm">Trusted Cars. Honest Deals.</p>
            <p className="mt-2 text-sm flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <a href="tel:+919000771660" className="hover:text-primary transition-colors">9000 771 660</a>
            </p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Our Location</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0795988090067!2d78.40519599999999!3d17.503713299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910263c39411%3A0x47305d0373141a0d!2sAshok%20Reddy%20Cars!5e0!3m2!1sen!2sin!4v1771041881594!5m2!1sen!2sin"
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: "0.5rem" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ashok Reddy Cars location"
            />
          </div>
          <div className="flex flex-col items-start md:items-end justify-between">
            <p className="text-xs">© {new Date().getFullYear()} Ashok Reddy Cars. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
