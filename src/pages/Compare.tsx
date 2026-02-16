import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, X, Plus, Fuel, Gauge, Calendar, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCars } from "@/hooks/useCars";
import { supabase } from "@/integrations/supabase/client";

const Compare = () => {
  const { data: cars } = useCars({ status: "all" });
  const [car1Id, setCar1Id] = useState<string>("");
  const [car2Id, setCar2Id] = useState<string>("");

  const car1 = cars?.find((c) => c.id === car1Id);
  const car2 = cars?.find((c) => c.id === car2Id);

  const getImage = (car: any) => {
    if (!car?.images?.length) return null;
    return supabase.storage.from("car-images").getPublicUrl(car.images[0].image_url).data.publicUrl;
  };

  const specs = [
    { label: "Price", key: "price", format: (v: number) => `₹${v.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Fuel Type", key: "fuel_type", format: (v: string) => v, icon: Fuel },
    { label: "KM Driven", key: "km_driven", format: (v: number) => `${v.toLocaleString()} km`, icon: Gauge },
    { label: "Year", key: "year", format: (v: number | null) => v ? String(v) : "N/A", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient py-16 pt-28">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl font-bold text-primary-foreground md:text-5xl flex items-center justify-center gap-3">
            <ArrowLeftRight className="h-10 w-10" /> Compare Cars
          </motion.h1>
          <p className="mt-3 text-primary-foreground/80">Select two cars to compare side by side</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Selectors */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Label className="font-heading font-semibold text-foreground">Car 1</Label>
            <Select value={car1Id} onValueChange={setCar1Id}>
              <SelectTrigger className="mt-2 bg-muted"><SelectValue placeholder="Select a car" /></SelectTrigger>
              <SelectContent>
                {cars?.map((c) => (
                  <SelectItem key={c.id} value={c.id} disabled={c.id === car2Id}>
                    {c.brand} {c.model} {c.year ? `(${c.year})` : ""} — ₹{c.price.toLocaleString("en-IN")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <Label className="font-heading font-semibold text-foreground">Car 2</Label>
            <Select value={car2Id} onValueChange={setCar2Id}>
              <SelectTrigger className="mt-2 bg-muted"><SelectValue placeholder="Select a car" /></SelectTrigger>
              <SelectContent>
                {cars?.map((c) => (
                  <SelectItem key={c.id} value={c.id} disabled={c.id === car1Id}>
                    {c.brand} {c.model} {c.year ? `(${c.year})` : ""} — ₹{c.price.toLocaleString("en-IN")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparison Table */}
        {car1 && car2 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            {/* Images */}
            <div className="grid grid-cols-3">
              <div className="p-4 border-b border-r border-border bg-muted/50 flex items-center justify-center">
                <span className="font-heading font-bold text-foreground">Specification</span>
              </div>
              {[car1, car2].map((car) => {
                const img = getImage(car);
                return (
                  <div key={car.id} className="p-4 border-b border-r border-border text-center">
                    {img && <img src={img} alt={`${car.brand} ${car.model}`} className="h-32 w-full object-cover rounded-xl mb-3" />}
                    <Link to={`/car/${car.id}`} className="font-heading font-bold text-foreground hover:text-primary transition-colors">
                      {car.brand} {car.model}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Specs rows */}
            {specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-3">
                <div className="p-4 border-b border-r border-border bg-muted/50 flex items-center gap-2">
                  <spec.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{spec.label}</span>
                </div>
                {[car1, car2].map((car) => (
                  <div key={car.id} className="p-4 border-b border-r border-border text-center">
                    <span className="text-sm font-semibold text-foreground">{spec.format((car as any)[spec.key] as never)}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Status row */}
            <div className="grid grid-cols-3">
              <div className="p-4 border-r border-border bg-muted/50 flex items-center">
                <span className="text-sm font-medium text-foreground">Status</span>
              </div>
              {[car1, car2].map((car) => (
                <div key={car.id} className="p-4 border-r border-border text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    car.status === "sold" ? "bg-destructive/10 text-destructive" :
                    car.status === "upcoming" ? "bg-yellow-100 text-yellow-700" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {car.status === "sold" ? "SOLD" : car.status === "upcoming" ? "UPCOMING" : "AVAILABLE"}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Difference */}
            <div className="p-6 text-center bg-muted/30">
              <p className="text-sm text-muted-foreground">Price Difference</p>
              <p className="font-heading text-2xl font-bold text-primary">
                ₹{Math.abs(car1.price - car2.price).toLocaleString("en-IN")}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border">
            <ArrowLeftRight className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Select two cars above to start comparing</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className || "text-sm font-medium text-foreground"}>{children}</label>
);

export default Compare;
