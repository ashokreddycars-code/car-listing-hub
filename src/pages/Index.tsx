import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
            Find Your <span className="text-gradient">Dream Car</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            Browse quality pre-owned vehicles at the best prices
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
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AutoHub. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
