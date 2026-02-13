import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Car {
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
  is_sold: boolean;
  created_at: string;
  images: { id: string; image_url: string; display_order: number }[];
}

export interface CarFilters {
  brand?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const useCars = (filters?: CarFilters) => {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select("*, car_images(id, image_url, display_order)")
        .eq("is_sold", false)
        .order("created_at", { ascending: false });

      if (filters?.brand) query = query.eq("brand", filters.brand);
      if (filters?.fuelType) query = query.eq("fuel_type", filters.fuelType);
      if (filters?.minPrice) query = query.gte("price", filters.minPrice);
      if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
      if (filters?.search) query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((car: any) => ({
        ...car,
        images: (car.car_images ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
      })) as Car[];
    },
  });
};

export const useCarById = (id: string) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*, car_images(id, image_url, display_order)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return {
        ...data,
        images: (data.car_images ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
      } as Car;
    },
    enabled: !!id,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("brand")
        .eq("is_sold", false);
      if (error) throw error;
      const brands = [...new Set((data ?? []).map((c) => c.brand))].sort();
      return brands;
    },
  });
};
