import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Car {
  id: string;
  user_id: string;
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
  status: "available" | "sold" | "upcoming";
  created_at: string;
  images: { id: string; image_url: string; display_order: number }[];
}

export interface CarFilters {
  brand?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: "available" | "sold" | "upcoming" | "all";
  minYear?: number;
  maxYear?: number;
  sortBy?: "price_asc" | "price_desc" | "year_desc" | "year_asc" | "km_asc" | "km_desc" | "newest";
}

export const useCars = (filters?: CarFilters) => {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: async () => {
      let query = supabase
        .from("cars")
        .select("*, car_images(id, image_url, display_order)");

      // Status filter (default: available only)
      const status = filters?.status ?? "available";
      if (status === "available") query = query.eq("status", "available");
      else if (status === "sold") query = query.eq("status", "sold");
      else if (status === "upcoming") query = query.eq("status", "upcoming");
      // "all" = no filter

      if (filters?.brand) query = query.eq("brand", filters.brand);
      if (filters?.fuelType) query = query.eq("fuel_type", filters.fuelType);
      if (filters?.minPrice) query = query.gte("price", filters.minPrice);
      if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
      if (filters?.minYear) query = query.gte("year", filters.minYear);
      if (filters?.maxYear) query = query.lte("year", filters.maxYear);
      if (filters?.search) query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);

      // Sorting
      const sortBy = filters?.sortBy ?? "newest";
      switch (sortBy) {
        case "price_asc": query = query.order("price", { ascending: true }); break;
        case "price_desc": query = query.order("price", { ascending: false }); break;
        case "year_desc": query = query.order("year", { ascending: false, nullsFirst: false }); break;
        case "year_asc": query = query.order("year", { ascending: true, nullsFirst: false }); break;
        case "km_asc": query = query.order("km_driven", { ascending: true }); break;
        case "km_desc": query = query.order("km_driven", { ascending: false }); break;
        default: query = query.order("created_at", { ascending: false }); break;
      }

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
        .eq("status", "available");
      if (error) throw error;
      const brands = [...new Set((data ?? []).map((c) => c.brand))].sort();
      return brands;
    },
  });
};
