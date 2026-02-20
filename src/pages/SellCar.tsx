import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Car, Upload, X, CheckCircle, ArrowRight, ImageIcon, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];

const SellCar = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    brand: "", model: "", year: "", km_driven: "", price: "",
    fuel_type: "Petrol", transmission: "Manual",
    contact_phone: "", contact_whatsapp: "", description: "",
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (photos.length + files.length > 10) {
      toast({ title: "Max 10 photos allowed", variant: "destructive" });
      return;
    }
    const validFiles = files.filter(f => {
      if (!f.type.startsWith("image/")) {
        toast({ title: `${f.name} is not an image`, variant: "destructive" });
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast({ title: `${f.name} is too large (max 10MB)`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setPhotos(prev => [...prev, ...validFiles]);
    validFiles.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreviews(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to list your car", variant: "destructive" });
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast({ title: "Please enter a valid price", variant: "destructive" });
      return;
    }
    if (form.contact_phone && !/^[\d+\s-]{7,20}$/.test(form.contact_phone)) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    if (form.year && (Number(form.year) < 1900 || Number(form.year) > new Date().getFullYear() + 1)) {
      toast({ title: "Please enter a valid year", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Insert car record
      const { data: carData, error: carError } = await supabase.from("cars").insert({
        user_id: user.id,
        brand: form.brand,
        model: form.model,
        year: form.year ? Number(form.year) : null,
        km_driven: form.km_driven ? Number(form.km_driven) : 0,
        price: Number(form.price),
        fuel_type: form.fuel_type,
        description: form.description || null,
        contact_phone: form.contact_phone || null,
        contact_whatsapp: form.contact_whatsapp || null,
        status: "available",
      }).select().single();

      if (carError) throw carError;

      // 2. Upload photos
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          const ext = file.name.split(".").pop();
          const path = `${carData.id}/${Date.now()}_${i}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("car-images")
            .upload(path, file, { upsert: false });
          if (!uploadError) {
            await supabase.from("car_images").insert({
              car_id: carData.id,
              image_url: path,
              display_order: i,
            });
          }
        }
      }

      setSubmitted(true);
      toast({ title: "🎉 Car listed successfully!", description: "Your car is now live on the marketplace." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <div className="h-8 w-48 animate-pulse bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full hero-gradient">
              <Car className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">List Your Car for Free</h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Sign in or create a free account to post your car listing on our marketplace. It's quick and completely free!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login?redirect=/sell">
                <Button size="lg" className="hero-gradient text-primary-foreground font-semibold px-8">
                  <LogIn className="mr-2 h-5 w-5" /> Sign In to List Your Car
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full hero-gradient">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Your Car is Live! 🎉</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Your listing is now visible to buyers on the marketplace.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="hero-gradient text-primary-foreground font-semibold">
                Browse All Listings
              </Button>
            </Link>
            <Button variant="outline" onClick={() => { setSubmitted(false); setPhotos([]); setPhotoPreviews([]); setForm({ brand: "", model: "", year: "", km_driven: "", price: "", fuel_type: "Petrol", transmission: "Manual", contact_phone: "", contact_whatsapp: "", description: "" }); }}>
              List Another Car
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient py-16 pt-28">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            Sell Your Car — <span className="underline decoration-4 underline-offset-4">Free Listing</span>
          </motion.h1>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            Post your car with photos. Reach thousands of buyers instantly. No charges, no commission.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" /> Car Details
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">

            {/* Photos */}
            <div>
              <Label className="text-base font-semibold">Car Photos</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-3">Add up to 10 photos. First photo will be the cover image.</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground hover:opacity-90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground font-semibold">Cover</span>
                    )}
                  </div>
                ))}
                {photos.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors text-muted-foreground gap-1"
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-xs">Add Photo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoSelect}
              />
              {photos.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm font-medium">Click to upload photos</span>
                </button>
              )}
            </div>

            {/* Car Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Car Brand *</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Maruti, Hyundai, Honda" />
              </div>
              <div>
                <Label>Car Model *</Label>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Swift, Creta, City" />
              </div>
              <div>
                <Label>Asking Price (₹) *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. 500000" min={1} />
              </div>
              <div>
                <Label>Year of Manufacture</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1 bg-muted" placeholder="e.g. 2020" min={1990} max={new Date().getFullYear() + 1} />
              </div>
              <div>
                <Label>KM Driven</Label>
                <Input type="number" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} className="mt-1 bg-muted" placeholder="e.g. 45000" min={0} />
              </div>
              <div>
                <Label>Fuel Type</Label>
                <Select value={form.fuel_type} onValueChange={(v) => setForm({ ...form, fuel_type: v })}>
                  <SelectTrigger className="mt-1 bg-muted"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transmission</Label>
                <Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v })}>
                  <SelectTrigger className="mt-1 bg-muted"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="mt-1 bg-muted" placeholder="+91 9000 000 000" />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input value={form.contact_whatsapp} onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })} className="mt-1 bg-muted" placeholder="91XXXXXXXXXX" />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-muted" rows={4} placeholder="Car condition, service history, modifications, reason for selling, any accessories included..." maxLength={2000} />
              <p className="mt-1 text-xs text-muted-foreground text-right">{form.description.length}/2000</p>
            </div>

            <Button type="submit" disabled={submitting} size="lg" className="w-full hero-gradient text-primary-foreground font-semibold text-base">
              {submitting ? "Publishing your listing..." : "Publish Car Listing"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellCar;
