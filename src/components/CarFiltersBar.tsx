import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CarFilters } from "@/hooks/useCars";
import { useBrands } from "@/hooks/useCars";
import { useState } from "react";

interface Props {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
}

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const PRICE_RANGES = [
  { label: "Under ₹2 Lakh", min: 0, max: 200000 },
  { label: "₹2–5 Lakh", min: 200000, max: 500000 },
  { label: "₹5–10 Lakh", min: 500000, max: 1000000 },
  { label: "₹10–20 Lakh", min: 1000000, max: 2000000 },
  { label: "Above ₹20 Lakh", min: 2000000, max: undefined },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest" },
  { value: "year_asc", label: "Year: Oldest" },
  { value: "km_asc", label: "KM: Low to High" },
  { value: "km_desc", label: "KM: High to Low" },
];

const CarFiltersBar = ({ filters, onChange }: Props) => {
  const { data: brands } = useBrands();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hasFilters = filters.brand || filters.fuelType || filters.search || filters.minPrice || filters.maxPrice || filters.status || filters.sortBy;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
      {/* Main row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search brand or model..."
            value={filters.search ?? ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
            className="pl-10 bg-muted border-border"
          />
        </div>

        <Select
          value={filters.brand ?? "all"}
          onValueChange={(v) => onChange({ ...filters, brand: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="bg-muted border-border">
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
          <SelectTrigger className="bg-muted border-border">
            <SelectValue placeholder="Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            {FUEL_TYPES.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-1 text-muted-foreground border-border"
          >
            <SlidersHorizontal className="mr-1 h-4 w-4" /> More Filters
          </Button>
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

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-3">
          {/* Price Range */}
          <Select
            value={
              filters.minPrice !== undefined || filters.maxPrice !== undefined
                ? `${filters.minPrice ?? 0}-${filters.maxPrice ?? "max"}`
                : "all"
            }
            onValueChange={(v) => {
              if (v === "all") {
                onChange({ ...filters, minPrice: undefined, maxPrice: undefined });
              } else {
                const range = PRICE_RANGES.find(
                  (r) => `${r.min}-${r.max ?? "max"}` === v
                );
                if (range) {
                  onChange({ ...filters, minPrice: range.min || undefined, maxPrice: range.max });
                }
              }
            }}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={r.label} value={`${r.min}-${r.max ?? "max"}`}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={filters.status ?? "available"}
            onValueChange={(v) => onChange({ ...filters, status: v as CarFilters["status"] })}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="all">All Cars</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={filters.sortBy ?? "newest"}
            onValueChange={(v) => onChange({ ...filters, sortBy: v as CarFilters["sortBy"] })}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Filter */}
          <Input
            type="number"
            placeholder="Min Year (e.g. 2018)"
            value={filters.minYear ?? ""}
            onChange={(e) => onChange({ ...filters, minYear: e.target.value ? Number(e.target.value) : undefined })}
            className="bg-muted border-border"
          />
        </div>
      )}
    </div>
  );
};

export default CarFiltersBar;
