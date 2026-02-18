import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Upload, GripVertical } from "lucide-react";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

interface CarImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  fuel_type: string;
  km_driven: number;
  year: number | null;
  description: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  car_images: CarImage[];
}

interface Props {
  car: Car;
  open: boolean;
  onClose: () => void;
}

const AdminCarEditModal = ({ car, open, onClose }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [form, setForm] = useState({
    brand: car.brand,
    model: car.model,
    price: String(car.price),
    fuel_type: car.fuel_type,
    km_driven: String(car.km_driven),
    year: car.year ? String(car.year) : "",
    description: car.description ?? "",
    contact_phone: car.contact_phone ?? "",
    contact_whatsapp: car.contact_whatsapp ?? "",
  });

  const [existingImages, setExistingImages] = useState<CarImage[]>(
    [...(car.car_images || [])].sort((a, b) => a.display_order - b.display_order)
  );

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const { data } = supabase.storage.from("car-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("cars").update({
        brand: form.brand,
        model: form.model,
        price: Number(form.price),
        fuel_type: form.fuel_type,
        km_driven: Number(form.km_driven),
        year: form.year ? Number(form.year) : null,
        description: form.description || null,
        contact_phone: form.contact_phone || null,
        contact_whatsapp: form.contact_whatsapp || null,
      }).eq("id", car.id);

      if (error) throw error;

      toast({ title: "Car details updated!" });
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["featured-cars"] });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (image: CarImage) => {
    if (!confirm("Delete this image?")) return;
    try {
      // Delete from storage
      await supabase.storage.from("car-images").remove([image.image_url]);
      // Delete from DB
      const { error } = await supabase.from("car_images").delete().eq("id", image.id);
      if (error) throw error;

      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
      toast({ title: "Image deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUploadImages = async (files: FileList) => {
    setUploadingImages(true);
    try {
      const startOrder = existingImages.length;
      const newImages: CarImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${car.id}/${Date.now()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("car-images").upload(path, file);
        if (uploadErr) throw uploadErr;

        const { data, error } = await supabase.from("car_images")
          .insert({ car_id: car.id, image_url: path, display_order: startOrder + i })
          .select()
          .single();
        if (error) throw error;
        newImages.push(data);
      }

      setExistingImages((prev) => [...prev, ...newImages]);
      toast({ title: `${files.length} image(s) uploaded!` });
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Edit: {car.brand} {car.model}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div>
            <Label>Brand *</Label>
            <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div>
            <Label>Model *</Label>
            <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div>
            <Label>Price (₹) *</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div>
            <Label>KM Driven *</Label>
            <Input type="number" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div>
            <Label>Year</Label>
            <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div>
            <Label>Fuel Type</Label>
            <Select value={form.fuel_type} onValueChange={(v) => setForm({ ...form, fuel_type: v })}>
              <SelectTrigger className="mt-1 bg-muted"><SelectValue /></SelectTrigger>
              <SelectContent>{FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Contact Phone</Label>
            <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input value={form.contact_whatsapp} onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })} className="mt-1 bg-muted" />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-muted" rows={3} />
          </div>
        </div>

        {/* Images Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">Images ({existingImages.length})</Label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleUploadImages(e.target.files)}
                disabled={uploadingImages}
              />
              <Button type="button" variant="outline" size="sm" asChild disabled={uploadingImages}>
                <span>
                  <Upload className="mr-1 h-4 w-4" />
                  {uploadingImages ? "Uploading..." : "Add Images"}
                </span>
              </Button>
            </label>
          </div>

          {existingImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
                  <img
                    src={getImageUrl(img.image_url)}
                    alt="Car"
                    className="w-full h-24 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                    #{img.display_order + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
              No images yet. Click "Add Images" to upload.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="hero-gradient text-primary-foreground font-semibold">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCarEditModal;
