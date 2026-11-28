"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MOCK_PRODUCTS,
  Product,
  ProductCategory,
  FitnessGoal,
} from "@/data/mockProducts";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopToolbar from "@/components/shop/ShopToolbar";
import FilterSidebar, {
  FilterState,
  MAX_PRICE_LIMIT,
} from "@/components/shop/FilterSidebar";
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
      minPrice: 0,
      maxPrice: MAX_PRICE_LIMIT,
      inStockOnly: false,
      verifiedOnly: false,
    };
  });

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(12);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    const syncAdminProducts = () => {
      try {
        const stored = window.localStorage.getItem("aurafit_admin_products");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCatalogProducts(parsed);
          }
        }
      } catch {
        // ignore
      }
    };
    const timer = setTimeout(syncAdminProducts, 0);
    window.addEventListener("storage", syncAdminProducts);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", syncAdminProducts);
    };
  }, []);

  // Compute live category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalogProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [catalogProducts]);

  // Compute live brand item counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalogProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [catalogProducts]);

  // Compute live goal item counts
  const goalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalogProducts.forEach((p) => {
      counts[p.goal] = (counts[p.goal] || 0) + 1;
    });
    return counts;
  }, [catalogProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
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

      // 5. Price Range Filter (Dual-Thumb Slider)
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
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
      if (sortBy === "newest") {
        const aNew = a.badge === "NEW" ? 1 : 0;
        const bNew = b.badge === "NEW" ? 1 : 0;
        if (aNew !== bNew) return bNew - aNew;
        return b.id.localeCompare(a.id);
      }
      return 0; // "featured" / default sorting maintains catalog order
    });
  }, [catalogProducts, filters, searchQuery, sortBy]);

  const displayedProducts = useMemo(() => {
    if (itemsPerPage === "all") return filteredProducts;
    return filteredProducts.slice(0, itemsPerPage);
  }, [filteredProducts, itemsPerPage]);

  const hasPriceFilter =
    filters.minPrice > 0 || filters.maxPrice < MAX_PRICE_LIMIT;

  // Active filter count for badge
  const activeFilterCount =
    filters.categories.length +
    filters.goals.length +
    filters.brands.length +
    (hasPriceFilter ? 1 : 0) +
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
      minPrice: 0,
      maxPrice: MAX_PRICE_LIMIT,
      inStockOnly: false,
      verifiedOnly: false,
    });
    setSearchQuery("");
  };

  return (
    <div className="w-full min-h-screen bg-[#09090B]">
      {/* 1. Header Banner & Search */}
      <ShopHeader
        totalProducts={filteredProducts.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Shop Content (Sidebar + Toolbar + Product Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-start gap-8">
          {/* Desktop Left Sidebar & Mobile Drawer */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearAll={handleClearAll}
            isDesktopOpen={isDesktopSidebarOpen}
            isMobileOpen={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
            categoryCounts={categoryCounts}
            brandCounts={brandCounts}
            goalCounts={goalCounts}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Right Column: Top Control Bar + Product Grid */}
          <div className="flex-1 min-w-0">
            <ShopToolbar
              isSidebarOpen={isDesktopSidebarOpen}
              onToggleSidebar={() => setIsDesktopSidebarOpen((prev) => !prev)}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              visibleCount={displayedProducts.length}
              totalCount={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              activeFilterCount={activeFilterCount}
            />

            <ShopGrid
              products={displayedProducts}
              viewMode={viewMode}
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
                setFilters((prev) => ({
                  ...prev,
                  minPrice: 0,
                  maxPrice: MAX_PRICE_LIMIT,
                }))
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
