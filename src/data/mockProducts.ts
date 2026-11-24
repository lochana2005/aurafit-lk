export type ProductCategory =
  | "Whey Protein"
  | "Mass Gainer"
  | "Creatine"
  | "Pre Workout"
  | "BCAA"
  | "Multivitamins";

export type FitnessGoal =
  | "Muscle Gain"
  | "Lean Cutting"
  | "Strength & Power"
  | "Recovery";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  goal: FitnessGoal;
  price: number;
  originalPrice?: number;
  weight: string;
  weightOrServings: string; // for UI display consistency
  flavors: string[];
  inStock: boolean;
  verifiedBatch: boolean;
  isVerified?: boolean; // alias for verifiedBatch
  rating: number;
  reviewsCount: number;
  badge?: "BEST SELLER" | "VERIFIED ORIGINAL" | "TOP RATED" | "NEW";
  image: string;
  kokoInstallment?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface HeroSlide {
  id: string;
  tag: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface EditorialBanner {
  id: string;
  title: string;
  sublabel: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    tag: "SRI LANKA'S AUTHENTIC SUPPLEMENT VAULT",
    headline: "DIRECT-FROM-MANUFACTURER PERFORMANCE NUTRITION",
    subtext:
      "100% verified authentic whey, creatine, and pre-workouts. Direct imports backed by laboratory QR batch verification.",
    ctaText: "Shop Supplements",
    ctaLink: "/shop",
    image: "/images/banners/hero-main.jpg",
  },
  {
    id: "slide-2",
    tag: "HYDROLYZED ISOLATE SERIES",
    headline: "MAXIMUM BIOAVAILABILITY. ZERO COMPROMISE.",
    subtext:
      "Fast-absorbing, ultra-pure whey protein isolate engineered for lean hypertrophy and accelerated recovery.",
    ctaText: "Explore Isolates",
    ctaLink: "/shop?cat=whey-protein",
    image: "/images/banners/hero-isolate.jpg",
  },
  {
    id: "slide-3",
    tag: "HIGH STIMULANT ENERGY & PUMP",
    headline: "EXPLOSIVE POWER. LASER FOCUS.",
    subtext:
      "Clinical doses of Citrulline Malate, Beta-Alanine, and caffeine matrix formulated for Sri Lankan athletes.",
    ctaText: "Shop Pre-Workouts",
    ctaLink: "/shop?cat=pre-workout",
    image: "/images/banners/hero-preworkout.jpg",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "cat-whey",
    name: "Whey Protein",
    slug: "whey-protein",
    image: "/images/categories/whey-protein.png",
    count: 32,
  },
  {
    id: "cat-gainer",
    name: "Mass Gainer",
    slug: "mass-gainer",
    image: "/images/categories/mass-gainer.png",
    count: 18,
  },
  {
    id: "cat-creatine",
    name: "Creatine",
    slug: "creatine",
    image: "/images/categories/creatine.png",
    count: 14,
  },
  {
    id: "cat-preworkout",
    name: "Pre Workout",
    slug: "pre-workout",
    image: "/images/categories/pre-workout.png",
    count: 24,
  },
  {
    id: "cat-bcaa",
    name: "BCAA",
    slug: "bcaa",
    image: "/images/categories/bcaa.png",
    count: 12,
  },
  {
    id: "cat-vitamins",
    name: "Multivitamins",
    slug: "multivitamins",
    image: "/images/categories/multivitamins.png",
    count: 20,
  },
];

export const EDITORIAL_BANNERS: EditorialBanner[] = [
  {
    id: "ed-whey",
    title: "WHEY ISOLATE",
    sublabel: "25+ VARIETIES IMPORTED",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=whey-protein",
    image: "/images/banners/editorial-whey.jpg",
  },
  {
    id: "ed-preworkout",
    title: "PRE WORKOUT",
    sublabel: "EXPLOSIVE PUMP FORMULAS",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=pre-workout",
    image: "/images/banners/editorial-preworkout.jpg",
  },
  {
    id: "ed-creatine",
    title: "CREATINE",
    sublabel: "CREAPURE® & MICRONIZED",
    ctaText: "Shop Now",
    ctaLink: "/shop?cat=creatine",
    image: "/images/banners/editorial-creatine.jpg",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "on-gold-standard-isolate",
    slug: "optimum-nutrition-gold-standard-isolate",
    name: "Gold Standard 100% Isolate (5 lbs)",
    brand: "Optimum Nutrition",
    category: "Whey Protein",
    goal: "Muscle Gain",
    price: 32500,
    originalPrice: 36000,
    weight: "5 lbs",
    weightOrServings: "5.0 lbs (74 Servings)",
    flavors: ["Double Rich Chocolate", "French Vanilla", "Strawberry Shake"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.9,
    reviewsCount: 342,
    badge: "BEST SELLER",
    kokoInstallment: "or 3 x Rs. 10,833 with KOKO",
    image: "/images/products/gold-standard-isolate.png",
  },
  {
    id: "dymatize-iso100-hydrolyzed",
    slug: "dymatize-iso100-hydrolyzed-whey",
    name: "ISO100 Hydrolyzed 100% Whey Isolate (5 lbs)",
    brand: "Dymatize",
    category: "Whey Protein",
    goal: "Lean Cutting",
    price: 34900,
    originalPrice: 38000,
    weight: "5 lbs",
    weightOrServings: "5.0 lbs (71 Servings)",
    flavors: ["Gourmet Chocolate", "Fudge Brownie", "Birthday Cake"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.95,
    reviewsCount: 420,
    badge: "TOP RATED",
    kokoInstallment: "or 3 x Rs. 11,633 with KOKO",
    image: "/images/products/iso100-hydrolyzed.png",
  },
  {
    id: "muscletech-nitro-tech-ripped",
    slug: "muscletech-nitro-tech-ripped",
    name: "Nitro-Tech Ripped Lean Protein (4 lbs)",
    brand: "MuscleTech",
    category: "Whey Protein",
    goal: "Lean Cutting",
    price: 28500,
    originalPrice: 31500,
    weight: "4 lbs",
    weightOrServings: "4.0 lbs (42 Servings)",
    flavors: ["French Vanilla", "Chocolate Fudge"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.8,
    reviewsCount: 215,
    kokoInstallment: "or 3 x Rs. 9,500 with KOKO",
    image: "/images/products/nitro-tech-ripped.png",
  },
  {
    id: "rc-king-mass-xl",
    slug: "ronnie-coleman-king-mass-xl",
    name: "King Mass XL Super Weight Gainer (15 lbs)",
    brand: "Ronnie Coleman",
    category: "Mass Gainer",
    goal: "Muscle Gain",
    price: 38900,
    originalPrice: 42500,
    weight: "15 lbs",
    weightOrServings: "15.0 lbs (108 Scoops)",
    flavors: ["Dark Chocolate", "Cookies & Cream", "Strawberry"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.85,
    reviewsCount: 189,
    badge: "VERIFIED ORIGINAL",
    kokoInstallment: "or 3 x Rs. 12,966 with KOKO",
    image: "/images/products/king-mass-xl.png",
  },
  {
    id: "applied-critical-mass-pro",
    slug: "applied-nutrition-critical-mass",
    name: "Critical Mass Professional Weight Gainer (13.2 lbs)",
    brand: "Applied Nutrition",
    category: "Mass Gainer",
    goal: "Muscle Gain",
    price: 29800,
    originalPrice: 33000,
    weight: "13.2 lbs",
    weightOrServings: "13.2 lbs (40 Servings)",
    flavors: ["White Chocolate", "Banana", "Vanilla Ice Cream"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.75,
    reviewsCount: 142,
    kokoInstallment: "or 3 x Rs. 9,933 with KOKO",
    image: "/images/products/critical-mass.png",
  },
  {
    id: "muscletech-platinum-creatine",
    slug: "muscletech-platinum-micronized-creatine",
    name: "Platinum 100% Micronized Creatine (400g)",
    brand: "MuscleTech",
    category: "Creatine",
    goal: "Strength & Power",
    price: 14500,
    originalPrice: 16500,
    weight: "400g",
    weightOrServings: "400g (80 Servings)",
    flavors: ["Unflavored"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.95,
    reviewsCount: 512,
    badge: "BEST SELLER",
    kokoInstallment: "or 3 x Rs. 4,833 with KOKO",
    image: "/images/products/platinum-creatine.png",
  },
  {
    id: "applied-creatine-monohydrate",
    slug: "applied-nutrition-creatine-monohydrate",
    name: "Micronized Creatine Monohydrate (250g)",
    brand: "Applied Nutrition",
    category: "Creatine",
    goal: "Strength & Power",
    price: 13800,
    originalPrice: 15500,
    weight: "250g",
    weightOrServings: "250g (50 Servings)",
    flavors: ["Unflavored"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.9,
    reviewsCount: 310,
    kokoInstallment: "or 3 x Rs. 4,600 with KOKO",
    image: "/images/products/applied-creatine.png",
  },
  {
    id: "cellucor-c4-ultimate",
    slug: "cellucor-c4-ultimate-preworkout",
    name: "C4 Ultimate Extreme Pre-Workout (380g)",
    brand: "Cellucor",
    category: "Pre Workout",
    goal: "Strength & Power",
    price: 21900,
    originalPrice: 24000,
    weight: "380g",
    weightOrServings: "380g (40 Servings)",
    flavors: ["Icy Blue Razz", "Fruit Punch", "Sour Batch Bros"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.85,
    reviewsCount: 278,
    badge: "NEW",
    kokoInstallment: "or 3 x Rs. 7,300 with KOKO",
    image: "/images/products/c4-ultimate.png",
  },
  {
    id: "applied-abe-preworkout",
    slug: "applied-nutrition-abe-pre-workout",
    name: "All Black Everything (ABE) Pre-Workout (315g)",
    brand: "Applied Nutrition",
    category: "Pre Workout",
    goal: "Strength & Power",
    price: 18900,
    originalPrice: 21000,
    weight: "315g",
    weightOrServings: "315g (30 Servings)",
    flavors: ["Energy Ice", "Sour Apple", "Blue Lagoon"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.88,
    reviewsCount: 360,
    badge: "TOP RATED",
    kokoInstallment: "or 3 x Rs. 6,300 with KOKO",
    image: "/images/products/applied-abe.png",
  },
  {
    id: "dymatize-all9-amino",
    slug: "dymatize-all9-amino-full-spectrum",
    name: "All 9 Amino Full Spectrum BCAA + EAA (450g)",
    brand: "Dymatize",
    category: "BCAA",
    goal: "Recovery",
    price: 17500,
    originalPrice: 19500,
    weight: "450g",
    weightOrServings: "450g (30 Servings)",
    flavors: ["Juicy Watermelon", "Orange Cranberry", "Fruit Fusion"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.8,
    reviewsCount: 175,
    kokoInstallment: "or 3 x Rs. 5,833 with KOKO",
    image: "/images/products/dymatize-all9.png",
  },
  {
    id: "on-essential-amino-energy",
    slug: "optimum-nutrition-amino-energy",
    name: "Essential Amino Energy + Electrolytes (270g)",
    brand: "Optimum Nutrition",
    category: "BCAA",
    goal: "Recovery",
    price: 16800,
    originalPrice: 18500,
    weight: "270g",
    weightOrServings: "270g (30 Servings)",
    flavors: ["Blue Raspberry", "Green Apple", "Watermelon"],
    inStock: false,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.78,
    reviewsCount: 220,
    kokoInstallment: "or 3 x Rs. 5,600 with KOKO",
    image: "/images/products/on-amino-energy.png",
  },
  {
    id: "on-opti-men-multivitamin",
    slug: "optimum-nutrition-opti-men",
    name: "Opti-Men High Potency Daily Multivitamin",
    brand: "Optimum Nutrition",
    category: "Multivitamins",
    goal: "Recovery",
    price: 15200,
    originalPrice: 17000,
    weight: "150 Tabs",
    weightOrServings: "150 Tablets (50 Days)",
    flavors: ["Unflavored"],
    inStock: true,
    verifiedBatch: true,
    isVerified: true,
    rating: 4.92,
    reviewsCount: 295,
    badge: "BEST SELLER",
    kokoInstallment: "or 3 x Rs. 5,066 with KOKO",
    image: "/images/products/opti-men.png",
  },
];
