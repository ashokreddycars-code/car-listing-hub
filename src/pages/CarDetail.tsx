import { useParams, Link, useNavigate } from "react-router-dom";
import { useCarById } from "@/hooks/useCars";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EMICalculator from "@/components/EMICalculator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Fuel, Gauge, Calendar, Phone, MessageCircle, Share2, CheckCircle, AlertTriangle, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: car, isLoading } = useCarById(id!);
  const [activeImg, setActiveImg] = useState(0);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [markingAsSold, setMarkingAsSold] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user && car && (user.id === car.user_id || isAdmin);

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

  const handleMarkAsSold = async () => {
    if (!car) return;
    setMarkingAsSold(true);
    try {
      const { error } = await supabase
        .from("cars")
        .update({ status: "sold", is_sold: true })
        .eq("id", car.id);
      if (error) throw error;
      toast({ title: "✅ Marked as Sold", description: "This listing will be automatically removed after 7 days." });
      queryClient.invalidateQueries({ queryKey: ["car", id] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setMarkingAsSold(false);
    }
  };

  const handleDelete = async () => {
    if (!car) return;
    setDeleting(true);
    try {
      // Delete images from storage
      for (const img of car.images) {
        await supabase.storage.from("car-images").remove([img.image_url]);
      }
      // Delete car record (cascades to car_images)
      const { error } = await supabase.from("cars").delete().eq("id", car.id);
      if (error) throw error;
      toast({ title: "Listing deleted successfully" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setDeleting(false);
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

  const contactPhone = car.contact_phone || "9000771660";
  const contactWhatsapp = car.contact_whatsapp || "919000771660";

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

        {/* Owner Actions Bar */}
        {isOwner && (
          <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-border bg-muted/50 p-4">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-primary" />
              {isAdmin && user?.id !== car.user_id ? "Admin Controls" : "Your Listing"}
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              {car.status !== "sold" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" disabled={markingAsSold} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {markingAsSold ? "Updating..." : "Mark as Sold"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark this car as sold?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the {car.brand} {car.model} as sold. The listing will be automatically removed after 7 days.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleMarkAsSold} className="hero-gradient text-primary-foreground">
                        Yes, Mark as Sold
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" disabled={deleting} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="mr-1 h-4 w-4" />
                    {deleting ? "Deleting..." : "Delete Listing"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the {car.brand} {car.model} listing and all its photos. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

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

            {/* Contact Buttons */}
            <div className="mt-8 space-y-3">
              {car.status === "sold" ? (
                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                  <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 font-heading font-semibold text-foreground">This car has been sold</p>
                  <p className="text-sm text-muted-foreground">Browse other available cars</p>
                  <Link to="/" className="mt-3 inline-block">
                    <Button className="hero-gradient text-primary-foreground font-semibold">
                      View Available Cars
                    </Button>
                  </Link>
                </div>
              ) : car.status === "upcoming" ? (
                <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                  <p className="font-heading font-semibold text-foreground">🔔 This car is coming soon!</p>
                  <p className="text-sm text-muted-foreground mt-1">Call us to reserve or get notified</p>
                  <a href={`tel:+${contactPhone}`} className="mt-3 inline-block">
                    <Button className="hero-gradient text-primary-foreground font-semibold">
                      <Phone className="mr-2 h-4 w-4" /> Reserve Now
                    </Button>
                  </a>
                </div>
              ) : (
                <>
                  <a href={`tel:+${contactPhone.replace(/\D/g, "")}`}>
                    <Button className="w-full hero-gradient text-primary-foreground font-semibold" size="lg">
                      <Phone className="mr-2 h-5 w-5" /> Call Seller — {contactPhone}
                    </Button>
                  </a>
                  <a href={`https://wa.me/${contactWhatsapp.replace(/\D/g, "")}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
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
