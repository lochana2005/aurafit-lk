"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MOCK_PRODUCTS,
  Product,
  ProductCategory,
  FitnessGoal,
} from "@/data/mockProducts";
import ShopHeader from "@/components/shop/ShopHeader";
import FilterSidebar, { FilterState } from "@/components/shop/FilterSidebar";
import ShopGrid from "@/components/shop/ShopGrid";

const SLUG_TO_CATEGORY: Record<string, ProductCategory> = {
  "whey-protein": "Whey Protein",
  "mass-gainer": "Mass Gainer",
  "creatine": "Creatine",
  "pre-workout": "Pre Workout",
  "bcaa": "BCAA",
  "multivitamins": "Multivitamins",
  whey: "Whey Protein",
  isolate: "Whey Protein",
};

function ShopContent() {
  const searchParams = useSearchParams();

  // Initialize filters directly from URL search params without useEffect setState
  const [filters, setFilters] = useState<FilterState>(() => {
    const catParam = searchParams.get("cat") || searchParams.get("category");
    const goalParam = searchParams.get("goal");
    const brandParam = searchParams.get("brand");

    const newCategories: ProductCategory[] = [];
    if (catParam) {
      const normalized =
        SLUG_TO_CATEGORY[catParam.toLowerCase()] ||
        (Object.values(SLUG_TO_CATEGORY).find(
          (c) => c.toLowerCase() === catParam.toLowerCase()
        ) as ProductCategory);
      if (normalized) {
        newCategories.push(normalized);
      }
    }

    const newGoals: FitnessGoal[] = [];
    if (goalParam) {
      const matchGoal = (
        ["Muscle Gain", "Lean Cutting", "Strength & Power", "Recovery"] as FitnessGoal[]
      ).find((g) => g.toLowerCase() === goalParam.toLowerCase());
      if (matchGoal) newGoals.push(matchGoal);
    }

    const newBrands: string[] = [];
    if (brandParam) {
      const matchBrand = [
        "Optimum Nutrition",
        "Dymatize",
        "Applied Nutrition",
        "MuscleTech",
        "Ronnie Coleman",
        "Cellucor",
        "MyProtein",
        "BSN",
      ].find(
        (b) =>
          b.toLowerCase() === brandParam.toLowerCase() ||
          b.toLowerCase().replace(/\s+/g, "-") === brandParam.toLowerCase()
      );
      if (matchBrand) {
        newBrands.push(matchBrand);
      } else {
        newBrands.push(brandParam);
      }
    }

    return {
      categories: newCategories,
      goals: newGoals,
      brands: newBrands,
      priceRange: "all",
      inStockOnly: false,
      verifiedOnly: false,
    };
  });

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Compute live category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Compute live brand item counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_PRODUCTS.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, []);

  // Compute live goal item counts
  const goalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_PRODUCTS.forEach((p) => {
      counts[p.goal] = (counts[p.goal] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesFlavor = product.flavors?.some((f) =>
          f.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesFlavor) {
          return false;
        }
      }

      // 2. Category Filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      // 3. Goal Filter
      if (filters.goals.length > 0 && !filters.goals.includes(product.goal)) {
        return false;
      }

      // 4. Brand Filter
      if (
        filters.brands.length > 0 &&
        !filters.brands.some(
          (b) => b.toLowerCase() === product.brand.toLowerCase()
        )
      ) {
        return false;
      }

      // 5. Price Range Filter
      if (filters.priceRange === "under-15k" && product.price >= 15000) {
        return false;
      }
      if (
        filters.priceRange === "15k-30k" &&
        (product.price < 15000 || product.price > 30000)
      ) {
        return false;
      }
      if (filters.priceRange === "over-30k" && product.price <= 30000) {
        return false;
      }

      // 6. In Stock Only
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // 7. QR Verified Only
      if (filters.verifiedOnly && !product.verifiedBatch) {
        return false;
      }

      return true;
    }).sort((a: Product, b: Product) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // "featured" maintains catalog default order
    });
  }, [filters, searchQuery, sortBy]);

  // Active filter count for mobile badge
  const activeFilterCount =
    filters.categories.length +
    filters.goals.length +
    filters.brands.length +
    (filters.priceRange !== "all" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0);

  const hasActiveFilters = Boolean(
    activeFilterCount > 0 || searchQuery.trim().length > 0
  );

  const handleClearAll = () => {
    setFilters({
      categories: [],
      goals: [],
      brands: [],
      priceRange: "all",
      inStockOnly: false,
      verifiedOnly: false,
    });
    setSearchQuery("");
  };

  return (
    <div className="w-full min-h-screen bg-[#09090B]">
      {/* 1. Header Toolbar */}
      <ShopHeader
        totalProducts={filteredProducts.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* 2. Main Shop Content (Sidebar + Product Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-start gap-8">
          {/* Desktop Left Sidebar & Mobile Drawer */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearAll={handleClearAll}
            isMobileOpen={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
            categoryCounts={categoryCounts}
            brandCounts={brandCounts}
            goalCounts={goalCounts}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Product Grid & Active Chips */}
          <ShopGrid
            products={filteredProducts}
            filters={filters}
            searchQuery={searchQuery}
            onRemoveCategory={(cat) =>
              setFilters((prev) => ({
                ...prev,
                categories: prev.categories.filter((c) => c !== cat),
              }))
            }
            onRemoveBrand={(b) =>
              setFilters((prev) => ({
                ...prev,
                brands: prev.brands.filter((brand) => brand !== b),
              }))
            }
            onRemoveGoal={(g) =>
              setFilters((prev) => ({
                ...prev,
                goals: prev.goals.filter((goal) => goal !== g),
              }))
            }
            onResetPrice={() =>
              setFilters((prev) => ({ ...prev, priceRange: "all" }))
            }
            onResetSearch={() => setSearchQuery("")}
            onToggleInStock={() =>
              setFilters((prev) => ({
                ...prev,
                inStockOnly: !prev.inStockOnly,
              }))
            }
            onToggleVerified={() =>
              setFilters((prev) => ({
                ...prev,
                verifiedOnly: !prev.verifiedOnly,
              }))
            }
            onClearAll={handleClearAll}
          />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-500 font-heading tracking-widest text-sm uppercase">
          Loading Supplement Vault...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
