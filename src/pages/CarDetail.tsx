import { useParams, Link } from "react-router-dom";
import { useCarById } from "@/hooks/useCars";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Fuel, Gauge, Calendar, Phone } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: car, isLoading } = useCarById(id!);
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="h-96 animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-muted-foreground">Car not found</p>
          <Link to="/"><Button className="mt-4">Back to listings</Button></Link>
        </div>
      </div>
    );
  }

  const images = car.images.map((img) =>
    supabase.storage.from("car-images").getPublicUrl(img.image_url).data.publicUrl
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No Image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      i === activeImg ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-4xl font-bold text-primary">₹{car.price.toLocaleString("en-IN")}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="card-gradient rounded-lg border border-border p-4">
                <Fuel className="h-5 w-5 text-primary" />
                <p className="mt-1 text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-semibold text-foreground">{car.fuel_type}</p>
              </div>
              <div className="card-gradient rounded-lg border border-border p-4">
                <Gauge className="h-5 w-5 text-primary" />
                <p className="mt-1 text-sm text-muted-foreground">KM Driven</p>
                <p className="font-semibold text-foreground">{car.km_driven.toLocaleString()}</p>
              </div>
              {car.year && (
                <div className="card-gradient rounded-lg border border-border p-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="mt-1 text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold text-foreground">{car.year}</p>
                </div>
              )}
            </div>

            {car.description && (
              <div className="mt-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">Description</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">{car.description}</p>
              </div>
            )}

            {car.contact_phone && (
              <a href={`tel:${car.contact_phone}`}>
                <Button className="mt-6 w-full hero-gradient text-primary-foreground font-semibold" size="lg">
                  <Phone className="mr-2 h-5 w-5" /> Call Now
                </Button>
              </a>
            )}
            {car.contact_whatsapp && (
              <a
                href={`https://wa.me/${car.contact_whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="mt-3 w-full" size="lg">
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
