import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Phone, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];

const benefits = [
  "Free car evaluation",
  "Best market price offered",
  "Instant payment on deal",
  "Complete paperwork handled",
  "Free pickup from your location",
  "Trusted by 500+ sellers",
];

const SellCar = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    owner_name: "", phone: "", whatsapp: "", brand: "", model: "",
    year: "", km_driven: "", fuel_type: "Petrol", transmission: "Manual",
    expected_price: "", description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("sell_inquiries").insert({
        owner_name: form.owner_name,
        phone: form.phone,
        whatsapp: form.whatsapp || null,
        brand: form.brand,
        model: form.model,
        year: form.year ? Number(form.year) : null,
        km_driven: form.km_driven ? Number(form.km_driven) : 0,
        fuel_type: form.fuel_type,
        transmission: form.transmission,
        expected_price: form.expected_price ? Number(form.expected_price) : null,
        description: form.description || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Inquiry submitted!", description: "We'll contact you soon." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full hero-gradient">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Thank You!</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Your car selling inquiry has been submitted successfully. Our team will review the details and contact you within 24 hours.
          </p>
          <p className="mt-4 font-heading text-xl font-bold text-primary">📞 9000 771 660</p>
          <a href="tel:+919000771660">
            <Button className="mt-4 hero-gradient text-primary-foreground font-semibold">
              <Phone className="mr-2 h-4 w-4" /> Call Us Now
            </Button>
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient py-20 pt-28">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl font-bold text-primary-foreground md:text-5xl">
            Sell Your Car at the <span className="underline decoration-4 underline-offset-4">Best Price</span>
          </motion.h1>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            Fill in your car details and get the best offer from Ashok Reddy Cars. Quick evaluation, instant payment!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Benefits sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" /> Why Sell to Us?
              </h2>
              <div className="mt-4 space-y-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Need help? Call us</p>
                <a href="tel:+919000771660" className="font-heading text-lg font-bold text-primary hover:underline">
                  9000 771 660
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-foreground">Enter Car Details</h2>
              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Your Name *</Label>
                  <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Ramesh" />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="mt-1 bg-muted" placeholder="+91 9000 771 660" />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="mt-1 bg-muted" placeholder="91XXXXXXXXXX" />
                </div>
                <div>
                  <Label>Car Brand *</Label>
                  <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Maruti, Hyundai" />
                </div>
                <div>
                  <Label>Car Model *</Label>
                  <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Swift, Creta" />
                </div>
                <div>
                  <Label>Year of Manufacture</Label>
                  <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1 bg-muted" placeholder="e.g. 2020" />
                </div>
                <div>
                  <Label>KM Driven</Label>
                  <Input type="number" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} className="mt-1 bg-muted" placeholder="e.g. 30000" />
                </div>
                <div>
                  <Label>Expected Price (₹)</Label>
                  <Input type="number" value={form.expected_price} onChange={(e) => setForm({ ...form, expected_price: e.target.value })} className="mt-1 bg-muted" placeholder="e.g. 500000" />
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
                <div className="sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-muted" rows={4} placeholder="Car condition, service history, modifications, reason for selling..." />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} size="lg" className="w-full hero-gradient text-primary-foreground font-semibold text-base">
                    {submitting ? "Submitting..." : "Submit Your Car Details"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellCar;
