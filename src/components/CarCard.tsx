import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fuel, Gauge, Calendar, ArrowRight } from "lucide-react";
import type { Car } from "@/hooks/useCars";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const CarCard = ({ car, index }: { car: Car; index: number }) => {
  const imageUrl = car.images[0]?.image_url
    ? supabase.storage.from("car-images").getPublicUrl(car.images[0].image_url).data.publicUrl
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link to={`/car/${car.id}`} className="group block">
        <div className={`overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${car.is_sold ? "border-muted opacity-80" : "border-border hover:border-primary/30"}`}>
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${car.brand} ${car.model}`}
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${car.is_sold ? "grayscale-[30%]" : ""}`}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            {/* Status Badge */}
            <div className="absolute top-3 left-3 flex gap-2">
              {car.is_sold ? (
                <Badge className="bg-destructive text-destructive-foreground font-semibold text-xs px-3 py-1">
                  SOLD
                </Badge>
              ) : (
                <Badge className="hero-gradient text-primary-foreground font-semibold text-xs px-3 py-1">
                  AVAILABLE
                </Badge>
              )}
            </div>
            {car.year && (
              <span className="absolute top-3 right-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {car.year}
              </span>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground">
                {car.brand} {car.model}
              </h3>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <p className={`mt-2 text-2xl font-bold ${car.is_sold ? "text-muted-foreground line-through" : "text-primary"}`}>
              ₹{car.price.toLocaleString("en-IN")}
            </p>
            {car.description && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{car.description}</p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
              <span className="flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-accent" />
                {car.fuel_type}
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-accent" />
                {car.km_driven.toLocaleString()} km
              </span>
              {car.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  {car.year}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
