"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MOCK_PRODUCTS, Product } from "@/data/mockProducts";
import { BATCH_REGISTRY } from "@/data/batchRegistry";
import {
  CoachAffiliate,
  PromoCode,
  CashbackPayout,
  DiscountValueType,
  PromoValidationResult,
  SEED_COACHES,
  SEED_PROMO_CODES,
  SEED_CASHBACK_PAYOUTS,
  evaluatePromoCode,
} from "@/data/affiliateSchema";
import { useToast } from "./ToastContext";

export interface StockHistoryEntry {
  id: string;
  delta: number;
  note: string;
  timestamp: string;
}

export interface AdminProduct extends Product {
  stockCount: number;
  lowStockThreshold: number;
  active: boolean;
  galleryImages?: string[];
  batchCode?: string;
  servingsCount?: string;
  highlights?: string[];
  description?: string;
  restockHistory?: StockHistoryEntry[];
}

export type AdminOrderStatus =
  | "Order Placed"
  | "Packed & QR Sealed"
  | "Handed to Courier"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type CourierProvider =
  | "Koombiyo Express"
  | "PromptX Courier"
  | "Domex"
  | "Colombo Flagship Rider";

export interface AdminOrderItem {
  name: string;
  quantity: number;
  price: number;
  flavor?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
  date: string;
  paymentMethod: "Card" | "COD" | "KOKO 3x";
  total: number;
  status: AdminOrderStatus;
  courier: CourierProvider;
  waybillNumber: string;
  estimatedArrival: string;
  riderNotes?: string;
  itemsSummary: string;
  items: AdminOrderItem[];
  promoCodeId?: string;
  promoCode?: string;
  coachId?: string;
  discountAmount?: number;
  cashbackAmount?: number;
}

export interface AdminBatch {
  batchNumber: string;
  brand: string;
  productName: string;
  lotNumber: string;
  expiryDate: string;
  coaStatus: "PASS" | "PENDING";
  status: "Verified" | "Revoked";
  scanCount: number;
}

export interface AdminMessage {
  id: string;
  ticketId: string;
  category: string;
  name: string;
  email: string;
  phone: string;
  orderId?: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  originCountry: string;
  isActive: boolean;
}

interface AdminContextType {
  isHydrated: boolean;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pin: string) => boolean;
  adminQuickLogin: () => void;
  adminLogout: () => void;
  products: AdminProduct[];
  saveProduct: (product: AdminProduct, isNew: boolean) => void;
  toggleProductActive: (id: string) => void;
  adjustStock: (id: string, delta: number, note?: string) => void;
  deleteProduct: (id: string) => void;
  orders: AdminOrder[];
  recordOrder: (order: AdminOrder) => void;
  updateOrderDispatch: (
    orderId: string,
    updates: {
      status?: AdminOrderStatus;
      courier?: CourierProvider;
      waybillNumber?: string;
      estimatedArrival?: string;
      riderNotes?: string;
    }
  ) => void;
  batches: AdminBatch[];
  generateBatch: (input: {
    batchNumber: string;
    brand: string;
    productName: string;
    lotNumber: string;
    expiryDate: string;
  }) => void;
  toggleBatchStatus: (batchNumber: string) => void;
  messages: AdminMessage[];
  toggleMessageResolved: (id: string) => void;
  categories: AdminCategory[];
  addCategory: (
    input:
      | string
      | { name: string; tagline?: string; image?: string; isActive?: boolean },
    tagline?: string
  ) => void;
  updateCategory: (id: string, updates: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;
  reorderCategory: (id: string, direction: "up" | "down") => void;
  brands: AdminBrand[];
  addBrand: (name: string, originCountry?: string) => void;
  updateBrand: (id: string, updates: Partial<AdminBrand>) => void;
  deleteBrand: (id: string) => void;
  toggleBrandStatus: (id: string) => void;
  coaches: CoachAffiliate[];
  promoCodes: PromoCode[];
  cashbackPayouts: CashbackPayout[];
  savePromoAffiliate: (input: {
    promoId?: string;
    coachId?: string;
    code: string;
    coachName: string;
    contactInfo: string;
    email?: string;
    discountType: DiscountValueType;
    discountValue: number;
    cashbackType: DiscountValueType;
    cashbackValue: number;
    isActive: boolean;
  }) => { ok: boolean; error?: string };
  togglePromoStatus: (id: string) => void;
  deletePromoCode: (id: string) => void;
  recordCashbackPayout: (input: {
    coachId: string;
    promoCodeId: string;
    amountLkr: number;
    referenceNote: string;
  }) => void;
  validatePromoCode: (code: string, subtotal: number) => PromoValidationResult;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const ADMIN_KEYS = {
  AUTH: "aurafit_admin_auth",
  PRODUCTS: "aurafit_admin_products",
  ORDERS: "aurafit_orders",
  BATCHES: "aurafit_admin_batches",
  MESSAGES: "aurafit_admin_messages",
  CONTACT_TICKETS: "aurafit_contact_tickets",
  CATEGORIES: "aurafit_admin_categories",
  BRANDS: "aurafit_admin_brands",
  COACHES: "aurafit_admin_coaches",
  PROMO_CODES: "aurafit_admin_promos",
  CASHBACK_PAYOUTS: "aurafit_admin_payouts",
};

const toSlug = (val: string) =>
  val
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const SEED_CATEGORIES: AdminCategory[] = [
  { id: "cat_1", name: "Whey Protein", slug: "whey-protein", tagline: "Ultra-pure isolates & blends", image: "/images/categories/whey-protein.png", sortOrder: 0, isActive: true },
  { id: "cat_2", name: "Mass Gainer", slug: "mass-gainer", tagline: "Clean caloric surplus formulas", image: "/images/categories/mass-gainer.png", sortOrder: 1, isActive: true },
  { id: "cat_3", name: "Creatine", slug: "creatine", tagline: "Micronized ATP strength fuel", image: "/images/categories/creatine.png", sortOrder: 2, isActive: true },
  { id: "cat_4", name: "Pre Workout", slug: "pre-workout", tagline: "Explosive focus & nitric pump", image: "/images/categories/pre-workout.png", sortOrder: 3, isActive: true },
  { id: "cat_5", name: "BCAA", slug: "bcaa", tagline: "Intra-workout amino recovery", image: "/images/categories/bcaa.png", sortOrder: 4, isActive: true },
  { id: "cat_6", name: "Amino", slug: "amino", tagline: "Essential EAA & hydration support", image: "/images/categories/amino.png", sortOrder: 5, isActive: true },
  { id: "cat_7", name: "Fat Burner", slug: "fat-burner", tagline: "Thermogenic shred & metabolism", image: "/images/categories/fat-burner.png", sortOrder: 6, isActive: true },
  { id: "cat_8", name: "Multivitamins", slug: "multivitamins", tagline: "Daily athlete micronutrient packs", image: "/images/categories/multivitamins.png", sortOrder: 7, isActive: true },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCategories(raw: any[]): AdminCategory[] {
  return raw
    .map((c, idx) => {
      const matchedSeed = SEED_CATEGORIES.find(
        (s) => s.id === c.id || s.slug === c.slug || s.name.toLowerCase() === String(c.name || "").toLowerCase()
      );
      return {
        id: c.id || `cat_${idx}`,
        name: c.name || "Category",
        slug: c.slug || toSlug(c.name || "category"),
        tagline: c.tagline || matchedSeed?.tagline || "Certified sports nutrition formula",
        image: typeof c.image === "string" ? c.image : matchedSeed?.image || "",
        sortOrder: typeof c.sortOrder === "number" ? c.sortOrder : idx,
        isActive: typeof c.isActive === "boolean" ? c.isActive : true,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export const SEED_BRANDS: AdminBrand[] = [
  { id: "brd_1", name: "Optimum Nutrition", slug: "optimum-nutrition", originCountry: "USA Direct", isActive: true },
  { id: "brd_2", name: "Dymatize", slug: "dymatize", originCountry: "USA Direct", isActive: true },
  { id: "brd_3", name: "MuscleTech", slug: "muscletech", originCountry: "USA Direct", isActive: true },
  { id: "brd_4", name: "Applied Nutrition", slug: "applied-nutrition", originCountry: "UK Direct", isActive: true },
  { id: "brd_5", name: "Ronnie Coleman", slug: "ronnie-coleman", originCountry: "USA Direct", isActive: true },
  { id: "brd_6", name: "Cellucor", slug: "cellucor", originCountry: "USA Direct", isActive: true },
  { id: "brd_7", name: "Universal Nutrition", slug: "universal-nutrition", originCountry: "USA Direct", isActive: true },
  { id: "brd_8", name: "BSN", slug: "bsn", originCountry: "USA Direct", isActive: true },
];

const SEED_PRODUCTS: AdminProduct[] = MOCK_PRODUCTS.map((p, idx) => ({
  ...p,
  stockCount: idx === 2 ? 3 : idx === 5 ? 4 : idx === 9 ? 0 : 18 + (idx % 5) * 6,
  lowStockThreshold: 5,
  active: idx !== 9 && p.inStock,
  inStock: idx !== 9 && p.inStock,
  galleryImages: [p.image],
  batchCode: `AF-${p.brand.slice(0, 2).toUpperCase()}-2026-${880 + idx}`,
  servingsCount: p.weightOrServings.includes("Servings")
    ? p.weightOrServings
    : "60 Servings",
  highlights: [
    "100% Direct USA/UK Manufacturer Import",
    "Tamper-Evident Holographic QR Batch Seal",
    "Climate-Controlled Colombo 03 Vault Storage",
  ],
  description: `Authentic ${p.brand} ${p.name} formulated for ${p.goal}. Laboratory assayed and verified for Sri Lankan athletes.`,
  restockHistory: [],
}));

const SEED_ORDERS: AdminOrder[] = [
  {
    id: "AF-2026-8492",
    customerName: "Kasun Perera",
    email: "kasun.p@gmail.com",
    phone: "+94 77 412 9088",
    address: "No. 45/2, Galle Road, Apt 4B",
    city: "Colombo 03",
    district: "Colombo",
    notes: "Call before delivery",
    date: "Nov 28, 2026",
    paymentMethod: "KOKO 3x",
    total: 35425,
    status: "Order Placed",
    courier: "PromptX Courier",
    waybillNumber: "PX-884120-LK",
    estimatedArrival: "Tomorrow, 2:00 PM – 5:00 PM",
    riderNotes: "Fragile holographic seal — keep upright",
    itemsSummary: "Gold Standard 100% Isolate (5 lbs) × 1",
    items: [
      {
        name: "Gold Standard 100% Isolate (5 lbs)",
        quantity: 1,
        price: 32500,
        flavor: "Double Rich Chocolate",
      },
    ],
    promoCodeId: "promo_coach10",
    promoCode: "COACH10",
    coachId: "coach_kasun_01",
    discountAmount: 3250,
    cashbackAmount: 1463,
  },
  {
    id: "AF-2026-7105",
    customerName: "Dilshan Jayawardena",
    email: "dilshan.j@gmail.com",
    phone: "+94 71 884 2210",
    address: "No. 18, Peradeniya Road",
    city: "Peradeniya",
    district: "Kandy",
    date: "Nov 27, 2026",
    paymentMethod: "Card",
    total: 18900,
    status: "In Transit",
    courier: "Domex",
    waybillNumber: "DMX-449012-LK",
    estimatedArrival: "Nov 29, 2026",
    itemsSummary: "C4 Original Pre-Workout (30 Serv) × 1",
    items: [
      {
        name: "C4 Original Explosive Pre-Workout",
        quantity: 1,
        price: 18900,
        flavor: "Icy Blue Razz",
      },
    ],
    promoCodeId: "promo_coach10",
    promoCode: "COACH10",
    coachId: "coach_kasun_01",
    discountAmount: 2100,
    cashbackAmount: 945,
  },
  {
    id: "AF-2026-7055",
    customerName: "Nadeesha Fernando",
    email: "nadeesha.f@gmail.com",
    phone: "+94 76 309 1124",
    address: "No. 102, Chilaw Road",
    city: "Negombo",
    district: "Gampaha",
    date: "Nov 27, 2026",
    paymentMethod: "COD",
    total: 41000,
    status: "Packed & QR Sealed",
    courier: "Koombiyo Express",
    waybillNumber: "KMB-193820-LK",
    estimatedArrival: "Nov 29, 2026",
    itemsSummary: "Critical Mass Original (6 kg) + Creatine × 1",
    items: [
      {
        name: "Critical Mass Original (6 kg)",
        quantity: 1,
        price: 29500,
        flavor: "Chocolate",
      },
      {
        name: "Micronized Creatine Powder (400g)",
        quantity: 1,
        price: 11500,
        flavor: "Unflavored",
      },
    ],
    promoCodeId: "promo_rohan1500",
    promoCode: "ROHAN1500",
    coachId: "coach_rohan_02",
    discountAmount: 1500,
    cashbackAmount: 1000,
  },
  {
    id: "AF-2026-6910",
    customerName: "Tharindu Silva",
    email: "tharindu.s@gmail.com",
    phone: "+94 77 990 3412",
    address: "No. 7, Lighthouse Street",
    city: "Galle Fort",
    district: "Galle",
    date: "Nov 25, 2026",
    paymentMethod: "KOKO 3x",
    total: 38900,
    status: "Delivered",
    courier: "PromptX Courier",
    waybillNumber: "PX-772104-LK",
    estimatedArrival: "Delivered Nov 26, 2026",
    itemsSummary: "Dymatize ISO100 Hydrolyzed (5 lbs) × 1",
    items: [
      {
        name: "ISO100 Hydrolyzed Whey Isolate (5 lbs)",
        quantity: 1,
        price: 38900,
        flavor: "Gourmet Chocolate",
      },
    ],
  },
];

// Normalize either Checkout OrderConfirmationData or AdminOrder into AdminOrder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOrderRecord(raw: any): AdminOrder {
  if (raw.id && raw.itemsSummary && raw.courier) {
    return raw as AdminOrder;
  }
  const orderId = raw.orderId || raw.id || `AF-${Date.now()}`;
  const itemsArr: AdminOrderItem[] = Array.isArray(raw.items)
    ? raw.items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (it: any) => ({
          name: it.product?.name || it.name || "Supplement",
          quantity: it.quantity || 1,
          price: it.product?.price || it.price || 0,
          flavor: it.selectedFlavor || it.flavor,
        })
      )
    : [];
  const itemsSummary =
    itemsArr.map((i) => `${i.name} × ${i.quantity}`).join(" + ") ||
    "Supplement Stack";
  const paymentMethod: AdminOrder["paymentMethod"] =
    raw.paymentMethod === "koko" || raw.isKoko || raw.paymentMethod === "KOKO 3x"
      ? "KOKO 3x"
      : raw.paymentMethod === "cod" || raw.paymentMethod === "COD"
      ? "COD"
      : "Card";

  return {
    id: orderId,
    customerName: raw.customerName || "Customer",
    email: raw.email,
    phone: raw.phone || "+94 77 000 0000",
    address: raw.address || "",
    city: raw.city || "Colombo",
    district: raw.district || "Colombo",
    postalCode: raw.postalCode || "00300",
    notes: raw.notes,
    date:
      raw.date ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    paymentMethod,
    total: Number(raw.total) || 0,
    status: raw.status || "Order Placed",
    courier: raw.courier || "PromptX Courier",
    waybillNumber: raw.waybillNumber || "",
    estimatedArrival: raw.estimatedArrival || "Within 24–48 Hours",
    riderNotes: raw.riderNotes,
    itemsSummary,
    items: itemsArr,
    promoCodeId: raw.promoCodeId,
    promoCode: raw.promoCode,
    coachId: raw.coachId,
    discountAmount: typeof raw.discountAmount === "number" ? raw.discountAmount : undefined,
    cashbackAmount: typeof raw.cashbackAmount === "number" ? raw.cashbackAmount : undefined,
  };
}

const SEED_BATCHES: AdminBatch[] = Object.values(BATCH_REGISTRY).map((b, i) => ({
  batchNumber: b.batchNumber,
  brand: b.product.brand,
  productName: `${b.product.name} (${b.product.weight})`,
  lotNumber: b.lotNumber,
  expiryDate: b.expiryDate,
  coaStatus: "PASS",
  status: "Verified",
  scanCount: 42 + i * 19,
}));

const SEED_MESSAGES: AdminMessage[] = [
  {
    id: "msg_1",
    ticketId: "TKT-2026-4412",
    category: "QR Batch Verification",
    name: "Shehan Rodrigo",
    email: "shehan.r@gmail.com",
    phone: "+94 77 551 0921",
    orderId: "AF-2026-7105",
    message: "Please confirm customs clearance date for batch AF-ON-8842.",
    createdAt: "Today, 10:20 AM",
    resolved: false,
  },
  {
    id: "msg_2",
    ticketId: "TKT-2026-3980",
    category: "Gym / Wholesale Inquiry",
    name: "IronWorks Fitness Colombo",
    email: "procurement@ironworks.lk",
    phone: "+94 11 258 9940",
    message: "Interested in monthly wholesale pricing for 20 tubs of Whey Isolate.",
    createdAt: "Yesterday, 4:15 PM",
    resolved: true,
  },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(SEED_ORDERS);
  const [batches, setBatches] = useState<AdminBatch[]>(SEED_BATCHES);
  const [messages, setMessages] = useState<AdminMessage[]>(SEED_MESSAGES);
  const [categories, setCategories] = useState<AdminCategory[]>(SEED_CATEGORIES);
  const [brands, setBrands] = useState<AdminBrand[]>(SEED_BRANDS);
  const [coaches, setCoaches] = useState<CoachAffiliate[]>(SEED_COACHES);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(SEED_PROMO_CODES);
  const [cashbackPayouts, setCashbackPayouts] = useState<CashbackPayout[]>(
    SEED_CASHBACK_PAYOUTS
  );

  const loadOrdersFromStorage = useCallback(() => {
    try {
      const rawOrders = window.localStorage.getItem(ADMIN_KEYS.ORDERS);
      if (rawOrders) {
        const parsed = JSON.parse(rawOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeOrderRecord);
          const existingIds = new Set(normalized.map((o) => o.id));
          return [
            ...normalized,
            ...SEED_ORDERS.filter((s) => !existingIds.has(s.id)),
          ];
        }
      }
    } catch {
      // ignore
    }
    return SEED_ORDERS;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (window.localStorage.getItem(ADMIN_KEYS.AUTH) === "true") {
          setIsAdminAuthenticated(true);
        }
        const p = window.localStorage.getItem(ADMIN_KEYS.PRODUCTS);
        if (p) setProducts(JSON.parse(p));

        setOrders(loadOrdersFromStorage());

        const b = window.localStorage.getItem(ADMIN_KEYS.BATCHES);
        if (b) setBatches(JSON.parse(b));

        const c = window.localStorage.getItem(ADMIN_KEYS.CATEGORIES);
        if (c) setCategories(normalizeCategories(JSON.parse(c)));

        const br = window.localStorage.getItem(ADMIN_KEYS.BRANDS);
        if (br) setBrands(JSON.parse(br));

        const co = window.localStorage.getItem(ADMIN_KEYS.COACHES);
        if (co) setCoaches(JSON.parse(co));

        const pr = window.localStorage.getItem(ADMIN_KEYS.PROMO_CODES);
        if (pr) setPromoCodes(JSON.parse(pr));

        const py = window.localStorage.getItem(ADMIN_KEYS.CASHBACK_PAYOUTS);
        if (py) setCashbackPayouts(JSON.parse(py));

        const m = window.localStorage.getItem(ADMIN_KEYS.MESSAGES);
        const contactTickets = window.localStorage.getItem(ADMIN_KEYS.CONTACT_TICKETS);
        let baseMessages: AdminMessage[] = m ? JSON.parse(m) : SEED_MESSAGES;
        if (contactTickets) {
          const parsedTickets: AdminMessage[] = JSON.parse(contactTickets);
          const existingIds = new Set(baseMessages.map((x) => x.ticketId));
          baseMessages = [
            ...parsedTickets.filter((t) => !existingIds.has(t.ticketId)),
            ...baseMessages,
          ];
        }
        setMessages(baseMessages);
      } catch {
        // ignore
      }
      setIsHydrated(true);
    }, 0);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_KEYS.ORDERS) {
        setOrders(loadOrdersFromStorage());
      }
      if (e.key === ADMIN_KEYS.PRODUCTS && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === ADMIN_KEYS.CATEGORIES && e.newValue) {
        try {
          setCategories(normalizeCategories(JSON.parse(e.newValue)));
        } catch {
          // ignore
        }
      }
      if (e.key === ADMIN_KEYS.BRANDS && e.newValue) {
        try {
          setBrands(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === ADMIN_KEYS.COACHES && e.newValue) {
        try {
          setCoaches(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === ADMIN_KEYS.PROMO_CODES && e.newValue) {
        try {
          setPromoCodes(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === ADMIN_KEYS.CASHBACK_PAYOUTS && e.newValue) {
        try {
          setCashbackPayouts(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadOrdersFromStorage]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ADMIN_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(ADMIN_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(ADMIN_KEYS.BATCHES, JSON.stringify(batches));
      localStorage.setItem(ADMIN_KEYS.MESSAGES, JSON.stringify(messages));
      localStorage.setItem(ADMIN_KEYS.CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(ADMIN_KEYS.BRANDS, JSON.stringify(brands));
      localStorage.setItem(ADMIN_KEYS.COACHES, JSON.stringify(coaches));
      localStorage.setItem(ADMIN_KEYS.PROMO_CODES, JSON.stringify(promoCodes));
      localStorage.setItem(
        ADMIN_KEYS.CASHBACK_PAYOUTS,
        JSON.stringify(cashbackPayouts)
      );
    } catch {
      // ignore
    }
  }, [
    products,
    orders,
    batches,
    messages,
    categories,
    brands,
    coaches,
    promoCodes,
    cashbackPayouts,
    isHydrated,
  ]);

  const adminLogin = useCallback(
    (email: string, pin: string) => {
      if (email.trim().toLowerCase() === "admin@gmail.com" && pin.trim() === "2026") {
        setIsAdminAuthenticated(true);
        try {
          localStorage.setItem(ADMIN_KEYS.AUTH, "true");
        } catch {
          // ignore
        }
        showToast({
          type: "gold",
          title: "Admin Vault Unlocked",
          subtitle: "Welcome to AuraFit.lk Command Center.",
        });
        return true;
      }
      showToast({
        type: "error",
        title: "Invalid Admin Credentials",
        subtitle: "Use admin@gmail.com and PIN 2026.",
      });
      return false;
    },
    [showToast]
  );

  const adminQuickLogin = useCallback(() => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem(ADMIN_KEYS.AUTH, "true");
    } catch {
      // ignore
    }
    showToast({
      type: "gold",
      title: "Demo Admin Quick Login",
      subtitle: "Authenticated as AuraFit Vault Administrator.",
    });
  }, [showToast]);

  const adminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_KEYS.AUTH);
    } catch {
      // ignore
    }
    showToast({
      type: "gold",
      title: "Signed Out of Admin Vault",
      subtitle: "Session securely locked.",
    });
  }, [showToast]);

  const saveProduct = useCallback(
    (product: AdminProduct, isNew: boolean) => {
      setProducts((prev) =>
        isNew
          ? [product, ...prev]
          : prev.map((p) => (p.id === product.id ? product : p))
      );
      showToast({
        type: "gold",
        title: "Product Saved",
        subtitle: `${product.name} synced to catalog & storefront.`,
      });
    },
    [showToast]
  );

  const toggleProductActive = useCallback(
    (id: string) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, active: !p.active, inStock: !p.active } : p
        )
      );
      showToast({
        type: "gold",
        title: "Product Saved",
        subtitle: "Inventory visibility status updated.",
      });
    },
    [showToast]
  );

  const adjustStock = useCallback(
    (id: string, delta: number, note?: string) => {
      const timestamp = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const nextStock = Math.max(0, p.stockCount + delta);
          const historyEntry: StockHistoryEntry = {
            id: `stk_${Date.now()}`,
            delta,
            note: note || (delta >= 0 ? "Warehouse restock" : "Manual adjustment"),
            timestamp,
          };
          return {
            ...p,
            stockCount: nextStock,
            inStock: nextStock > 0,
            active: nextStock > 0,
            restockHistory: [historyEntry, ...(p.restockHistory || [])].slice(0, 10),
          };
        })
      );
      showToast({
        type: "gold",
        title: "Stock Level Updated",
        subtitle: `${delta >= 0 ? `+${delta}` : delta} units recorded in audit log.`,
      });
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast({
        type: "gold",
        title: "Product Deleted",
        subtitle: "Supplement removed from Admin & Storefront catalog.",
      });
    },
    [showToast]
  );

  const updateOrderDispatch = useCallback(
    (
      orderId: string,
      updates: {
        status?: AdminOrderStatus;
        courier?: CourierProvider;
        waybillNumber?: string;
        estimatedArrival?: string;
        riderNotes?: string;
      }
    ) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      );
      showToast({
        type: "gold",
        title: "Order Status Updated",
        subtitle: `${orderId} dispatch & live tracking updated.`,
      });
    },
    [showToast]
  );

  const generateBatch = useCallback(
    (input: {
      batchNumber: string;
      brand: string;
      productName: string;
      lotNumber: string;
      expiryDate: string;
    }) => {
      const nextBatch: AdminBatch = {
        batchNumber: input.batchNumber.trim().toUpperCase(),
        brand: input.brand,
        productName: input.productName,
        lotNumber: input.lotNumber.trim().toUpperCase(),
        expiryDate: input.expiryDate,
        coaStatus: "PASS",
        status: "Verified",
        scanCount: 0,
      };
      setBatches((prev) => [nextBatch, ...prev]);
      showToast({
        type: "cyan",
        title: "New QR Batch Generated",
        subtitle: `${nextBatch.batchNumber} registered in Authenticity Vault.`,
      });
    },
    [showToast]
  );

  const toggleBatchStatus = useCallback(
    (batchNumber: string) => {
      setBatches((prev) =>
        prev.map((b) =>
          b.batchNumber === batchNumber
            ? { ...b, status: b.status === "Verified" ? "Revoked" : "Verified" }
            : b
        )
      );
      showToast({
        type: "cyan",
        title: "QR Batch Status Updated",
        subtitle: `${batchNumber} verification state toggled.`,
      });
    },
    [showToast]
  );

  const toggleMessageResolved = useCallback(
    (id: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, resolved: !m.resolved } : m))
      );
      showToast({
        type: "success",
        title: "Inquiry Status Updated",
        subtitle: "Support ticket queue refreshed.",
      });
    },
    [showToast]
  );

  const addCategory = useCallback(
    (
      input:
        | string
        | { name: string; tagline?: string; image?: string; isActive?: boolean },
      taglineArg = ""
    ) => {
      const cleanName = (typeof input === "string" ? input : input.name).trim();
      if (!cleanName) return;
      const resolvedTagline =
        typeof input === "string"
          ? taglineArg.trim()
          : (input.tagline || "").trim();
      const resolvedImage = typeof input === "string" ? "" : input.image || "";
      const resolvedActive =
        typeof input === "string"
          ? true
          : typeof input.isActive === "boolean"
          ? input.isActive
          : true;

      setCategories((prev) => {
        const nextOrder =
          prev.length > 0
            ? Math.max(...prev.map((c) => c.sortOrder ?? 0)) + 1
            : 0;
        const newCat: AdminCategory = {
          id: `cat_${Date.now()}`,
          name: cleanName,
          slug: toSlug(cleanName),
          tagline: resolvedTagline || "Certified sports nutrition formula",
          image: resolvedImage,
          sortOrder: nextOrder,
          isActive: resolvedActive,
        };
        return [...prev, newCat];
      });
      showToast({
        type: "gold",
        title: "Category Added",
        subtitle: `${cleanName} is now live across Storefront & Admin.`,
      });
    },
    [showToast]
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<AdminCategory>) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...updates,
                slug: updates.name ? toSlug(updates.name) : c.slug,
              }
            : c
        )
      );
      showToast({
        type: "gold",
        title: "Category Updated",
        subtitle: "Changes synced to Storefront & Catalog.",
      });
    },
    [showToast]
  );

  const toggleCategoryStatus = useCallback(
    (id: string) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
      showToast({
        type: "gold",
        title: "Category Visibility Updated",
        subtitle: "Storefront category display refreshed.",
      });
    },
    [showToast]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c, idx) => ({ ...c, sortOrder: idx }))
      );
      showToast({
        type: "gold",
        title: "Category Deleted",
        subtitle: "Category removed from catalog.",
      });
    },
    [showToast]
  );

  const reorderCategory = useCallback((id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const sorted = [...prev].sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = sorted.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= sorted.length) return prev;
      const [moved] = sorted.splice(idx, 1);
      sorted.splice(targetIdx, 0, moved);
      return sorted.map((c, i) => ({ ...c, sortOrder: i }));
    });
  }, []);

  const addBrand = useCallback(
    (name: string, originCountry = "USA Direct") => {
      const cleanName = name.trim();
      if (!cleanName) return;
      const newBrand: AdminBrand = {
        id: `brd_${Date.now()}`,
        name: cleanName,
        slug: toSlug(cleanName),
        originCountry: originCountry.trim() || "USA Direct",
        isActive: true,
      };
      setBrands((prev) => [...prev, newBrand]);
      showToast({
        type: "gold",
        title: "Brand Added",
        subtitle: `${cleanName} added to Official Brands & Marquee.`,
      });
    },
    [showToast]
  );

  const updateBrand = useCallback(
    (id: string, updates: Partial<AdminBrand>) => {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                ...updates,
                slug: updates.name ? toSlug(updates.name) : b.slug,
              }
            : b
        )
      );
      showToast({
        type: "gold",
        title: "Brand Updated",
        subtitle: "Official brand details synced.",
      });
    },
    [showToast]
  );

  const toggleBrandStatus = useCallback(
    (id: string) => {
      setBrands((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
      );
      showToast({
        type: "gold",
        title: "Brand Visibility Updated",
        subtitle: "Storefront marquee & filters refreshed.",
      });
    },
    [showToast]
  );

  const deleteBrand = useCallback(
    (id: string) => {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      showToast({
        type: "gold",
        title: "Brand Deleted",
        subtitle: "Brand removed from official roster.",
      });
    },
    [showToast]
  );

  const recordOrder = useCallback((order: AdminOrder) => {
    setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
  }, []);

  const savePromoAffiliate = useCallback(
    (input: {
      promoId?: string;
      coachId?: string;
      code: string;
      coachName: string;
      contactInfo: string;
      email?: string;
      discountType: DiscountValueType;
      discountValue: number;
      cashbackType: DiscountValueType;
      cashbackValue: number;
      isActive: boolean;
    }): { ok: boolean; error?: string } => {
      const cleanCode = input.code.trim().toUpperCase().replace(/\s+/g, "");
      const cleanCoachName = input.coachName.trim();
      const cleanContact = input.contactInfo.trim();

      if (!cleanCode || cleanCode.length < 3) {
        return { ok: false, error: "Promo code must be at least 3 characters." };
      }
      if (!cleanCoachName) {
        return { ok: false, error: "Coach / Seller name is required." };
      }

      const duplicate = promoCodes.find(
        (p) => p.code.toUpperCase() === cleanCode && p.id !== input.promoId
      );
      if (duplicate) {
        return { ok: false, error: `Promo code "${cleanCode}" already exists.` };
      }

      const nowIso = new Date().toISOString();
      const targetCoachId = input.coachId || `coach_${Date.now()}`;

      setCoaches((prev) => {
        const exists = prev.some((c) => c.id === targetCoachId);
        if (exists) {
          return prev.map((c) =>
            c.id === targetCoachId
              ? {
                  ...c,
                  name: cleanCoachName,
                  contactInfo: cleanContact || c.contactInfo,
                  email: input.email?.trim() || c.email,
                }
              : c
          );
        }
        return [
          {
            id: targetCoachId,
            name: cleanCoachName,
            contactInfo: cleanContact || "N/A",
            email: input.email?.trim() || undefined,
            isActive: true,
            createdAt: nowIso,
          },
          ...prev,
        ];
      });

      const targetPromoId = input.promoId || `promo_${Date.now()}`;
      setPromoCodes((prev) => {
        const exists = prev.some((p) => p.id === targetPromoId);
        if (exists) {
          return prev.map((p) =>
            p.id === targetPromoId
              ? {
                  ...p,
                  code: cleanCode,
                  coachId: targetCoachId,
                  discountType: input.discountType,
                  discountValue: Math.max(0, Number(input.discountValue) || 0),
                  cashbackType: input.cashbackType,
                  cashbackValue: Math.max(0, Number(input.cashbackValue) || 0),
                  isActive: input.isActive,
                }
              : p
          );
        }
        return [
          {
            id: targetPromoId,
            code: cleanCode,
            coachId: targetCoachId,
            discountType: input.discountType,
            discountValue: Math.max(0, Number(input.discountValue) || 0),
            cashbackType: input.cashbackType,
            cashbackValue: Math.max(0, Number(input.cashbackValue) || 0),
            isActive: input.isActive,
            createdAt: nowIso,
          },
          ...prev,
        ];
      });

      showToast({
        type: "gold",
        title: input.promoId ? "Promo Code Updated" : "Promo Code Created",
        subtitle: `${cleanCode} linked to ${cleanCoachName}.`,
      });
      return { ok: true };
    },
    [promoCodes, showToast]
  );

  const togglePromoStatus = useCallback(
    (id: string) => {
      setPromoCodes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
      showToast({
        type: "gold",
        title: "Promo Status Updated",
        subtitle: "Checkout promo validation updated live.",
      });
    },
    [showToast]
  );

  const deletePromoCode = useCallback(
    (id: string) => {
      setPromoCodes((prev) => prev.filter((p) => p.id !== id));
      showToast({
        type: "gold",
        title: "Promo Code Deleted",
        subtitle: "Promo code removed from active roster.",
      });
    },
    [showToast]
  );

  const recordCashbackPayout = useCallback(
    (input: {
      coachId: string;
      promoCodeId: string;
      amountLkr: number;
      referenceNote: string;
    }) => {
      const amount = Math.max(0, Math.round(Number(input.amountLkr) || 0));
      if (amount <= 0) return;
      const newPayout: CashbackPayout = {
        id: `pay_${Date.now()}`,
        coachId: input.coachId,
        promoCodeId: input.promoCodeId,
        amountLkr: amount,
        referenceNote: input.referenceNote.trim() || "Bank Transfer",
        paidAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        recordedBy: "Admin Vault",
      };
      setCashbackPayouts((prev) => [newPayout, ...prev]);
      showToast({
        type: "gold",
        title: "Cashback Payout Recorded",
        subtitle: `Rs. ${amount.toLocaleString()} marked as paid.`,
      });
    },
    [showToast]
  );

  const validatePromoCode = useCallback(
    (code: string, subtotal: number) =>
      evaluatePromoCode(code, subtotal, promoCodes, coaches),
    [promoCodes, coaches]
  );

  return (
    <AdminContext.Provider
      value={{
        isHydrated,
        isAdminAuthenticated,
        adminLogin,
        adminQuickLogin,
        adminLogout,
        products,
        saveProduct,
        toggleProductActive,
        adjustStock,
        deleteProduct,
        orders,
        recordOrder,
        updateOrderDispatch,
        batches,
        generateBatch,
        toggleBatchStatus,
        messages,
        toggleMessageResolved,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        reorderCategory,
        brands,
        addBrand,
        updateBrand,
        deleteBrand,
        toggleBrandStatus,
        coaches,
        promoCodes,
        cashbackPayouts,
        savePromoAffiliate,
        togglePromoStatus,
        deletePromoCode,
        recordCashbackPayout,
        validatePromoCode,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
