import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Car } from "lucide-react";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    brand: "", model: "", price: "", fuel_type: "Petrol", km_driven: "",
    year: "", description: "", contact_phone: "", contact_whatsapp: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { data: myCars, isLoading } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*, car_images(id, image_url, display_order)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  if (authLoading) return null;
  if (!user || !isAdmin) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: car, error } = await supabase.from("cars").insert({
        user_id: user.id,
        brand: form.brand,
        model: form.model,
        price: Number(form.price),
        fuel_type: form.fuel_type,
        km_driven: Number(form.km_driven),
        year: form.year ? Number(form.year) : null,
        description: form.description || null,
        contact_phone: form.contact_phone || null,
        contact_whatsapp: form.contact_whatsapp || null,
      }).select().single();
      if (error) throw error;

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `${car.id}/${Date.now()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("car-images").upload(path, file);
        if (uploadErr) throw uploadErr;

        await supabase.from("car_images").insert({
          car_id: car.id,
          image_url: path,
          display_order: i,
        });
      }

      toast({ title: "Car listed successfully!" });
      setForm({ brand: "", model: "", price: "", fuel_type: "Petrol", km_driven: "", year: "", description: "", contact_phone: "", contact_whatsapp: "" });
      setImages([]);
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (carId: string) => {
    if (!confirm("Delete this car listing?")) return;
    const { error } = await supabase.from("cars").delete().eq("id", carId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Car deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Add Car Form */}
        <div className="mt-8 card-gradient rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Add New Car
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Brand *</Label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="mt-1 bg-secondary" placeholder="e.g. Maruti" />
            </div>
            <div>
              <Label>Model *</Label>
              <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="mt-1 bg-secondary" placeholder="e.g. Swift" />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="mt-1 bg-secondary" placeholder="e.g. 500000" />
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={form.fuel_type} onValueChange={(v) => setForm({ ...form, fuel_type: v })}>
                <SelectTrigger className="mt-1 bg-secondary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>KM Driven *</Label>
              <Input type="number" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} required className="mt-1 bg-secondary" placeholder="e.g. 30000" />
            </div>
            <div>
              <Label>Year</Label>
              <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1 bg-secondary" placeholder="e.g. 2020" />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="mt-1 bg-secondary" placeholder="+91..." />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input value={form.contact_whatsapp} onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })} className="mt-1 bg-secondary" placeholder="91XXXXXXXXXX" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-secondary" rows={3} placeholder="Car condition, features..." />
            </div>
            <div className="sm:col-span-2">
              <Label>Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                className="mt-1 bg-secondary"
              />
              {images.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">{images.length} image(s) selected</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting} className="hero-gradient text-primary-foreground font-semibold">
                {submitting ? "Uploading..." : "Add Car"}
              </Button>
            </div>
          </form>
        </div>

        {/* Existing Cars */}
        <h2 className="mt-12 font-heading text-xl font-semibold text-foreground">Your Listings</h2>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />)}
          </div>
        ) : myCars && myCars.length > 0 ? (
          <div className="mt-4 space-y-3">
            {myCars.map((car: any) => (
              <div key={car.id} className="flex items-center justify-between card-gradient rounded-lg border border-border p-4">
                <div>
                  <p className="font-semibold text-foreground">{car.brand} {car.model}</p>
                  <p className="text-sm text-primary">₹{Number(car.price).toLocaleString("en-IN")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(car.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">No cars listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
