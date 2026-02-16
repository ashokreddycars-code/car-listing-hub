import { useParams, Link } from "react-router-dom";
import { useCarById } from "@/hooks/useCars";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EMICalculator from "@/components/EMICalculator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Fuel, Gauge, Calendar, Phone, MessageCircle, Share2, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: car, isLoading } = useCarById(id!);
  const [activeImg, setActiveImg] = useState(0);
  const { toast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    const text = car ? `Check out this ${car.brand} ${car.model} at Ashok Reddy Cars!` : "Check out this car!";
    if (navigator.share) {
      await navigator.share({ title: text, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
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

  const specs = [
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
    { icon: Gauge, label: "KM Driven", value: car.km_driven.toLocaleString() + " km" },
    ...(car.year ? [{ icon: Calendar, label: "Year", value: String(car.year) }] : []),
  ];

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in the ${car.brand} ${car.model} (₹${car.price.toLocaleString("en-IN")}) listed on Ashok Reddy Cars. Is it still available?`
  );

  const statusBadge = car.status === "sold" ? (
    <Badge className="bg-destructive text-destructive-foreground font-bold text-sm px-4 py-1.5">SOLD</Badge>
  ) : car.status === "upcoming" ? (
    <Badge className="bg-yellow-500 text-white font-bold text-sm px-4 py-1.5">UPCOMING</Badge>
  ) : (
    <Badge className="hero-gradient text-primary-foreground font-bold text-sm px-4 py-1.5">AVAILABLE</Badge>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground">
            <Share2 className="mr-1 h-4 w-4" /> Share
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted border border-border shadow-card">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No Image</div>
              )}
              <div className="absolute top-4 left-4">{statusBadge}</div>
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      i === activeImg ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{images.length} photo{images.length !== 1 ? "s" : ""} available</p>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {car.brand} {car.model}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <p className={`text-4xl font-bold ${car.status === "sold" ? "text-muted-foreground line-through" : "text-primary"}`}>
                ₹{car.price.toLocaleString("en-IN")}
              </p>
              {car.status === "sold" && (
                <span className="text-sm text-destructive font-semibold">(Sold Out)</span>
              )}
              {car.status === "upcoming" && (
                <span className="text-sm text-yellow-600 font-semibold">(Coming Soon)</span>
              )}
            </div>

            {/* Specs Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="mt-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">Description</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed whitespace-pre-line">{car.description}</p>
              </div>
            )}

            {/* Key Highlights */}
            <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-foreground mb-3">Buying from Ashok Reddy Cars includes:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {["Complete documentation", "RTO transfer assistance", "Insurance guidance", "Genuine KM history", "Multi-point inspection", "Post-sale support"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="mt-8 space-y-3">
              {car.status === "sold" ? (
                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 font-heading font-semibold text-foreground">This car has been sold</p>
                  <p className="text-sm text-muted-foreground">Contact us for similar options</p>
                  <a href="tel:+919000771660" className="mt-3 inline-block">
                    <Button className="hero-gradient text-primary-foreground font-semibold">
                      <Phone className="mr-2 h-4 w-4" /> Call for Similar Cars
                    </Button>
                  </a>
                </div>
              ) : car.status === "upcoming" ? (
                <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-center">
                  <p className="font-heading font-semibold text-foreground">🔔 This car is coming soon!</p>
                  <p className="text-sm text-muted-foreground mt-1">Call us to reserve or get notified</p>
                  <a href="tel:+919000771660" className="mt-3 inline-block">
                    <Button className="hero-gradient text-primary-foreground font-semibold">
                      <Phone className="mr-2 h-4 w-4" /> Reserve Now — 9000 771 660
                    </Button>
                  </a>
                </div>
              ) : (
                <>
                  <a href="tel:+919000771660">
                    <Button className="w-full hero-gradient text-primary-foreground font-semibold" size="lg">
                      <Phone className="mr-2 h-5 w-5" /> Call Now — 9000 771 660
                    </Button>
                  </a>
                  <a href={`https://wa.me/919000771660?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-3" size="lg">
                      <MessageCircle className="mr-2 h-5 w-5" /> Chat on WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* EMI Calculator */}
            {car.status !== "sold" && (
              <div className="mt-8">
                <EMICalculator carPrice={car.price} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDetail;
