import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Car } from "./useCars";

export const useFeaturedCars = () => {
  return useQuery({
    queryKey: ["featured-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*, car_images(id, image_url, display_order)")
        .eq("is_featured", true)
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []).map((car: any) => ({
        ...car,
        images: (car.car_images ?? []).sort((a: any, b: any) => a.display_order - b.display_order),
      })) as Car[];
    },
  });
};
