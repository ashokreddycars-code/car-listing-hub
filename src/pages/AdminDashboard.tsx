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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Car, BarChart3, Download, Eye, Clock, CheckCircle, XCircle, Star, Pencil } from "lucide-react";
import AdminCarEditModal from "@/components/AdminCarEditModal";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const STATUS_OPTIONS = [
  { value: "available", label: "Available", color: "hero-gradient text-primary-foreground" },
  { value: "sold", label: "Sold", color: "bg-destructive text-destructive-foreground" },
  { value: "upcoming", label: "Upcoming", color: "bg-yellow-500 text-white" },
];

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
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries">("listings");
  const [editingCar, setEditingCar] = useState<any>(null);

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

  const { data: inquiries } = useQuery({
    queryKey: ["sell-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sell_inquiries")
        .select("*")
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

  const stats = {
    total: myCars?.length ?? 0,
    available: myCars?.filter((c: any) => c.status === "available").length ?? 0,
    sold: myCars?.filter((c: any) => c.status === "sold").length ?? 0,
    upcoming: myCars?.filter((c: any) => c.status === "upcoming").length ?? 0,
    inquiries: inquiries?.length ?? 0,
  };

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

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `${car.id}/${Date.now()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("car-images").upload(path, file);
        if (uploadErr) throw uploadErr;
        await supabase.from("car_images").insert({ car_id: car.id, image_url: path, display_order: i });
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

  const handleStatusChange = async (carId: string, newStatus: string) => {
    const { error } = await supabase.from("cars").update({
      status: newStatus,
      is_sold: newStatus === "sold",
    }).eq("id", carId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status updated to ${newStatus}` });
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
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

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("sell_inquiries").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Inquiry deleted" });
      queryClient.invalidateQueries({ queryKey: ["sell-inquiries"] });
    }
  };

  const exportCSV = () => {
    if (!myCars?.length) return;
    const headers = ["Brand", "Model", "Price", "Status", "Fuel", "KM", "Year"];
    const rows = myCars.map((c: any) => [c.brand, c.model, c.price, c.status, c.fuel_type, c.km_driven, c.year ?? ""]);
    const csv = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ashok-reddy-cars-export.csv";
    a.click();
  };

  const statusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
    return <Badge className={`${opt.color} text-xs`}>{opt.label.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { label: "Total Cars", value: stats.total, icon: Car, color: "text-foreground" },
            { label: "Available", value: stats.available, icon: CheckCircle, color: "text-primary" },
            { label: "Sold", value: stats.sold, icon: XCircle, color: "text-destructive" },
            { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "text-yellow-500" },
            { label: "Sell Inquiries", value: stats.inquiries, icon: Eye, color: "text-accent" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card text-center">
              <s.icon className={`h-6 w-6 mx-auto ${s.color}`} />
              <p className="mt-1 font-heading text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-border">
          <button onClick={() => setActiveTab("listings")} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === "listings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            Car Listings
          </button>
          <button onClick={() => setActiveTab("inquiries")} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === "inquiries" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            Sell Inquiries ({stats.inquiries})
          </button>
        </div>

        {activeTab === "listings" ? (
          <>
            {/* Add Car Form */}
            <div className="mt-6 card-gradient rounded-2xl border border-border p-6 shadow-card">
              <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Add New Car
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><Label>Brand *</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Maruti" /></div>
                <div><Label>Model *</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. Swift" /></div>
                <div><Label>Price (₹) *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. 500000" /></div>
                <div>
                  <Label>Fuel Type</Label>
                  <Select value={form.fuel_type} onValueChange={(v) => setForm({ ...form, fuel_type: v })}>
                    <SelectTrigger className="mt-1 bg-muted"><SelectValue /></SelectTrigger>
                    <SelectContent>{FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>KM Driven *</Label><Input type="number" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} required className="mt-1 bg-muted" placeholder="e.g. 30000" /></div>
                <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1 bg-muted" placeholder="e.g. 2020" /></div>
                <div><Label>Contact Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="mt-1 bg-muted" placeholder="+91..." /></div>
                <div><Label>WhatsApp</Label><Input value={form.contact_whatsapp} onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })} className="mt-1 bg-muted" placeholder="91XXXXXXXXXX" /></div>
                <div className="sm:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-muted" rows={4} placeholder="Car condition, features..." /></div>
                <div className="sm:col-span-2">
                  <Label>Images</Label>
                  <Input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []))} className="mt-1 bg-muted" />
                  {images.length > 0 && <p className="mt-1 text-sm text-muted-foreground">{images.length} image(s) selected</p>}
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="hero-gradient text-primary-foreground font-semibold">
                    {submitting ? "Uploading..." : "Add Car"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Listings */}
            <div className="mt-8 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-foreground">Your Listings ({stats.total})</h2>
              <Button variant="outline" size="sm" onClick={exportCSV} disabled={!myCars?.length}>
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>
            </div>
            {isLoading ? (
              <div className="mt-4 space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}</div>
            ) : myCars && myCars.length > 0 ? (
              <div className="mt-4 space-y-3">
                {myCars.map((car: any) => (
                  <div key={car.id} className="flex items-center justify-between card-gradient rounded-xl border border-border p-4 shadow-card flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-heading font-semibold text-foreground">{car.brand} {car.model}</p>
                        {statusBadge(car.status)}
                      </div>
                      <p className="text-sm text-primary font-semibold">₹{Number(car.price).toLocaleString("en-IN")}</p>
                      {car.year && <p className="text-xs text-muted-foreground">{car.year} · {car.fuel_type} · {Number(car.km_driven).toLocaleString()} km</p>}
                    </div>
                     <div className="flex items-center gap-2">
                       <Select value={car.status} onValueChange={(v) => handleStatusChange(car.id, v)}>
                         <SelectTrigger className="w-[130px] bg-muted text-xs"><SelectValue /></SelectTrigger>
                         <SelectContent>
                           {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                         </SelectContent>
                       </Select>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={async () => {
                           const { error } = await supabase.from("cars").update({ is_featured: !car.is_featured }).eq("id", car.id);
                           if (!error) {
                             toast({ title: car.is_featured ? "Removed from featured" : "Marked as featured" });
                             queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
                             queryClient.invalidateQueries({ queryKey: ["featured-cars"] });
                           }
                         }}
                         className={car.is_featured ? "text-primary" : "text-muted-foreground"}
                         title={car.is_featured ? "Remove from featured" : "Mark as featured"}
                       >
                         <Star className={`h-4 w-4 ${car.is_featured ? "fill-primary" : ""}`} />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => setEditingCar(car)} className="text-muted-foreground hover:text-foreground" title="Edit car details">
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(car.id)} className="text-destructive hover:text-destructive">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">No cars listed yet.</p>
            )}
          </>
        ) : (
          /* Sell Inquiries Tab */
          <div className="mt-6 space-y-3">
            {inquiries && inquiries.length > 0 ? (
              inquiries.map((inq: any) => (
                <div key={inq.id} className="card-gradient rounded-xl border border-border p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-heading font-semibold text-foreground">{inq.brand} {inq.model}</p>
                        <Badge variant="outline" className="text-xs">{inq.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">{inq.owner_name}</span> · {inq.phone}
                        {inq.whatsapp && <> · WA: {inq.whatsapp}</>}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {inq.year && <span>Year: {inq.year}</span>}
                        <span>{inq.fuel_type}</span>
                        <span>{inq.transmission}</span>
                        <span>{Number(inq.km_driven).toLocaleString()} km</span>
                        {inq.expected_price && <span className="text-primary font-semibold">Expected: ₹{Number(inq.expected_price).toLocaleString("en-IN")}</span>}
                      </div>
                      {inq.description && <p className="mt-2 text-sm text-muted-foreground">{inq.description}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${inq.phone}`}>
                        <Button size="sm" className="hero-gradient text-primary-foreground text-xs">Call</Button>
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteInquiry(inq.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">No sell inquiries yet.</p>
            )}
          </div>
        )}

        {editingCar && (
          <AdminCarEditModal
            car={editingCar}
            open={!!editingCar}
            onClose={() => setEditingCar(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
