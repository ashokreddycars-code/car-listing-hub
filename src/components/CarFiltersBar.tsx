import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CarFilters } from "@/hooks/useCars";
import { useBrands } from "@/hooks/useCars";

interface Props {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
}

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

const CarFiltersBar = ({ filters, onChange }: Props) => {
  const { data: brands } = useBrands();
  const hasFilters = filters.brand || filters.fuelType || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="card-gradient rounded-xl border border-border p-4 shadow-card">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search brand or model..."
            value={filters.search ?? ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        <Select
          value={filters.brand ?? "all"}
          onValueChange={(v) => onChange({ ...filters, brand: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {(brands ?? []).map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.fuelType ?? "all"}
          onValueChange={(v) => onChange({ ...filters, fuelType: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            {FUEL_TYPES.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({})}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default CarFiltersBar;
