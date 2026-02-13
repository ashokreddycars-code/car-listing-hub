import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fuel, Gauge } from "lucide-react";
import type { Car } from "@/hooks/useCars";
import { supabase } from "@/integrations/supabase/client";

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
        <div className="card-gradient overflow-hidden rounded-xl border border-border shadow-card transition-all duration-300 hover:shadow-glow hover:border-primary/30">
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            {car.year && (
              <span className="absolute top-3 left-3 rounded-md bg-background/80 backdrop-blur px-2 py-1 text-xs font-medium text-foreground">
                {car.year}
              </span>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {car.brand} {car.model}
            </h3>
            <p className="mt-1 text-2xl font-bold text-primary">
              ₹{car.price.toLocaleString("en-IN")}
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Fuel className="h-4 w-4" />
                {car.fuel_type}
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                {car.km_driven.toLocaleString()} km
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
