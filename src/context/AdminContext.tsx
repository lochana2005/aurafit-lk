"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MOCK_PRODUCTS, Product } from "@/data/mockProducts";
import { BATCH_REGISTRY } from "@/data/batchRegistry";
import { useToast } from "./ToastContext";

export interface AdminProduct extends Product {
  stockCount: number;
  active: boolean;
}

export type AdminOrderStatus =
  | "Order Placed"
  | "Packed & QR Sealed"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered";

export type CourierProvider = "Koombiyo" | "PromptX" | "Domex";

export interface AdminOrder {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  district: string;
  date: string;
  paymentMethod: "Card" | "COD" | "KOKO 3x";
  total: number;
  status: AdminOrderStatus;
  courier: CourierProvider;
  waybillNumber: string;
  itemsSummary: string;
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

interface AdminContextType {
  isHydrated: boolean;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pin: string) => boolean;
  adminQuickLogin: () => void;
  adminLogout: () => void;
  products: AdminProduct[];
  saveProduct: (product: AdminProduct, isNew: boolean) => void;
  toggleProductActive: (id: string) => void;
  deleteProduct: (id: string) => void;
  orders: AdminOrder[];
  updateOrderDispatch: (
    orderId: string,
    updates: {
      status?: AdminOrderStatus;
      courier?: CourierProvider;
      waybillNumber?: string;
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
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const KEYS = {
  AUTH: "aurafit_admin_auth",
  PRODUCTS: "aurafit_admin_products",
  ORDERS: "aurafit_admin_orders",
  BATCHES: "aurafit_admin_batches",
  MESSAGES: "aurafit_admin_messages",
  CONTACT_TICKETS: "aurafit_contact_tickets",
};

const SEED_PRODUCTS: AdminProduct[] = MOCK_PRODUCTS.map((p, idx) => ({
  ...p,
  stockCount: idx === 2 ? 3 : idx === 5 ? 4 : idx === 9 ? 2 : 18 + (idx % 5) * 6,
  active: p.inStock,
}));

const SEED_ORDERS: AdminOrder[] = [
  {
    id: "AF-2026-8492",
    customerName: "Kasun Perera",
    phone: "+94 77 412 9088",
    city: "Colombo 03",
    district: "Colombo",
    date: "Nov 28, 2026",
    paymentMethod: "KOKO 3x",
    total: 35425,
    status: "Order Placed",
    courier: "PromptX",
    waybillNumber: "PX-CMB-88412",
    itemsSummary: "Gold Standard 100% Isolate (5 lbs) × 1",
  },
  {
    id: "AF-2026-7105",
    customerName: "Dilshan Jayawardena",
    phone: "+94 71 884 2210",
    city: "Peradeniya",
    district: "Kandy",
    date: "Nov 27, 2026",
    paymentMethod: "Card",
    total: 18900,
    status: "In Transit",
    courier: "Domex",
    waybillNumber: "DMX-KDY-44901",
    itemsSummary: "C4 Original Pre-Workout (30 Serv) × 1",
  },
  {
    id: "AF-2026-7055",
    customerName: "Nadeesha Fernando",
    phone: "+94 76 309 1124",
    city: "Negombo",
    district: "Gampaha",
    date: "Nov 27, 2026",
    paymentMethod: "COD",
    total: 41000,
    status: "Packed & QR Sealed",
    courier: "Koombiyo",
    waybillNumber: "KMB-GMP-19382",
    itemsSummary: "Critical Mass Original (6 kg) + Creatine × 1",
  },
  {
    id: "AF-2026-6910",
    customerName: "Tharindu Silva",
    phone: "+94 77 990 3412",
    city: "Galle Fort",
    district: "Galle",
    date: "Nov 25, 2026",
    paymentMethod: "KOKO 3x",
    total: 38900,
    status: "Delivered",
    courier: "PromptX",
    waybillNumber: "PX-GAL-77210",
    itemsSummary: "Dymatize ISO100 Hydrolyzed (5 lbs) × 1",
  },
];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (window.localStorage.getItem(KEYS.AUTH) === "true") {
          setIsAdminAuthenticated(true);
        }
        const p = window.localStorage.getItem(KEYS.PRODUCTS);
        if (p) setProducts(JSON.parse(p));

        const o = window.localStorage.getItem(KEYS.ORDERS);
        if (o) setOrders(JSON.parse(o));

        const b = window.localStorage.getItem(KEYS.BATCHES);
        if (b) setBatches(JSON.parse(b));

        const m = window.localStorage.getItem(KEYS.MESSAGES);
        const contactTickets = window.localStorage.getItem(KEYS.CONTACT_TICKETS);
        let baseMessages: AdminMessage[] = m ? JSON.parse(m) : SEED_MESSAGES;
        if (contactTickets) {
          const parsedTickets: AdminMessage[] = JSON.parse(contactTickets);
          const existingIds = new Set(baseMessages.map((x) => x.ticketId));
          const merged = [
            ...parsedTickets.filter((t) => !existingIds.has(t.ticketId)),
            ...baseMessages,
          ];
          baseMessages = merged;
        }
        setMessages(baseMessages);
      } catch {
        // ignore storage errors
      }
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(KEYS.BATCHES, JSON.stringify(batches));
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [products, orders, batches, messages, isHydrated]);

  const adminLogin = useCallback(
    (email: string, pin: string) => {
      if (email.trim().toLowerCase() === "admin@gmail.com" && pin.trim() === "2026") {
        setIsAdminAuthenticated(true);
        try {
          localStorage.setItem(KEYS.AUTH, "true");
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
      localStorage.setItem(KEYS.AUTH, "true");
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
      localStorage.removeItem(KEYS.AUTH);
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
        subtitle: `${product.name} updated in inventory.`,
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

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast({
        type: "gold",
        title: "Product Deleted",
        subtitle: "Supplement removed from Admin inventory.",
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
      }
    ) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      );
      showToast({
        type: "gold",
        title: "Order Status Updated",
        subtitle: `${orderId} dispatch record saved.`,
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
        deleteProduct,
        orders,
        updateOrderDispatch,
        batches,
        generateBatch,
        toggleBatchStatus,
        messages,
        toggleMessageResolved,
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
