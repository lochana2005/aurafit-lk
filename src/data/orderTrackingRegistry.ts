import { Product, MOCK_PRODUCTS } from "./mockProducts";

export type OrderDeliveryStatus =
  | "Order Confirmed"
  | "QR Hologram Sealed"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  location: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface TrackedItem {
  product: Product;
  flavorOrVariant: string;
  quantity: number;
  price: number;
  batchNumber: string;
}

export interface TrackedOrderRecord {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  city: string;
  district: string;
  status: OrderDeliveryStatus;
  currentStepIndex: number; // 1 to 4
  courierPartner: string;
  waybillNumber: string;
  estimatedDelivery: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending COD" | "KOKO Active";
  total: number;
  items: TrackedItem[];
  timeline: TimelineEvent[];
}

export const MOCK_TRACKED_ORDERS: Record<string, TrackedOrderRecord> = {
  "AF-2026-8492": {
    orderId: "AF-2026-8492",
    customerName: "Kasun Jayasundara",
    phone: "+94 77 123 4567",
    email: "kasun.j@aurafit.lk",
    deliveryAddress: "42/B, Flower Road, Colombo 07",
    city: "Colombo 07",
    district: "Colombo",
    status: "Out for Delivery",
    currentStepIndex: 3,
    courierPartner: "AuraFit Express · PromptX Courier",
    waybillNumber: "PX-9948210LK",
    estimatedDelivery: "Today, 2:00 PM – 5:00 PM",
    paymentMethod: "KOKO Pay (3 Monthly Installments)",
    paymentStatus: "KOKO Active",
    total: 35425,
    items: [
      {
        product: MOCK_PRODUCTS[0], // ON Gold Standard Isolate
        flavorOrVariant: "Double Rich Chocolate • 5 lbs",
        quantity: 1,
        price: 32500,
        batchNumber: "LOT# 094821-EXP28",
      },
      {
        product: MOCK_PRODUCTS[4], // Applied Nutrition Creatine
        flavorOrVariant: "Unflavored Micronized • 250g",
        quantity: 1,
        price: 2925,
        batchNumber: "LOT# 440118-EXP28",
      },
    ],
    timeline: [
      {
        id: "ev_1",
        timestamp: "1:15 PM · Today",
        location: "Colombo 07 Delivery Station",
        title: "Local Delivery Rider Dispatched",
        description:
          "Assigned to Express Rider Nuwan P. (+94 77 889 1234). En route to Flower Road, Colombo 07 in insulated temperature-controlled box.",
        isCompleted: true,
        isCurrent: true,
      },
      {
        id: "ev_2",
        timestamp: "10:45 AM · Today",
        location: "Colombo 03 Central Sorting Hub",
        title: "Package Processed at Regional Facility",
        description:
          "Inbound manifest scanned. Package sorted to Route #7 (Cinnamon Gardens / Col 07).",
        isCompleted: true,
      },
      {
        id: "ev_3",
        timestamp: "7:30 AM · Today",
        location: "Peliyagoda Central Logistics Hub",
        title: "Dispatched from Main Logistics Facility",
        description:
          "Loaded onto morning inter-city express shuttle to Colombo distribution hub.",
        isCompleted: true,
      },
      {
        id: "ev_4",
        timestamp: "4:30 PM · Yesterday",
        location: "AuraFit Importer Vault, Colombo 03",
        title: "QR Hologram Sealed & Quality Inspected",
        description:
          "Batch Lot #094821 and #440118 verified against Sri Lanka customs release certificates. Tamper-evident holographic security seals applied.",
        isCompleted: true,
      },
      {
        id: "ev_5",
        timestamp: "2:15 PM · Yesterday",
        location: "AuraFit Online System",
        title: "Order Placed & Payment Confirmed",
        description:
          "Order validated through KOKO Pay installment gateway (Auth Ref: KOKO-SL-884102).",
        isCompleted: true,
      },
    ],
  },
  "AF-2026-7910": {
    orderId: "AF-2026-7910",
    customerName: "Dr. Dinesh Perera",
    phone: "+94 71 456 7890",
    email: "dinesh.p@aurafit.lk",
    deliveryAddress: "18, Peradeniya Road, Kandy",
    city: "Kandy",
    district: "Kandy",
    status: "In Transit",
    currentStepIndex: 2,
    courierPartner: "Domex Express Delivery (Kandy Line)",
    waybillNumber: "DX-8823104LK",
    estimatedDelivery: "Tomorrow, by 12:00 PM",
    paymentMethod: "Credit / Debit Card (Online Secured)",
    paymentStatus: "Paid",
    total: 28500,
    items: [
      {
        product: MOCK_PRODUCTS[1], // Dymatize ISO100
        flavorOrVariant: "Gourmet Chocolate • 5 lbs",
        quantity: 1,
        price: 28500,
        batchNumber: "LOT# 011928-EXP28",
      },
    ],
    timeline: [
      {
        id: "ev_201",
        timestamp: "8:15 AM · Today",
        location: "Central Expressway Transit Route",
        title: "In Transit to Kandy Regional Center",
        description:
          "Shipment departed Peliyagoda highway transit point en route to Gatambe / Peradeniya sorting office.",
        isCompleted: true,
        isCurrent: true,
      },
      {
        id: "ev_202",
        timestamp: "6:00 AM · Today",
        location: "Peliyagoda Main Logistics Facility",
        title: "Outstation Manifest Bagged",
        description:
          "Barcodes logged into Domex Central Network for Central Province priority distribution.",
        isCompleted: true,
      },
      {
        id: "ev_203",
        timestamp: "6:30 PM · Yesterday",
        location: "AuraFit Importer Vault, Colombo 03",
        title: "Tamper-Evident QR Hologram Sealed",
        description:
          "Batch Lot #011928 confirmed genuine direct import from BellRing Brands, USA.",
        isCompleted: true,
      },
      {
        id: "ev_204",
        timestamp: "3:45 PM · Yesterday",
        location: "AuraFit Online System",
        title: "Order Received & Verified",
        description:
          "Online card payment cleared via 3D Secure 2.0 authentication.",
        isCompleted: true,
      },
    ],
  },
  "AF-2026-6304": {
    orderId: "AF-2026-6304",
    customerName: "Sachintha Silva",
    phone: "+94 76 998 8776",
    email: "sachintha.s@aurafit.lk",
    deliveryAddress: "77/4, Galle Road, Mount Lavinia",
    city: "Mount Lavinia",
    district: "Colombo",
    status: "Delivered",
    currentStepIndex: 4,
    courierPartner: "AuraFit Express · PromptX Courier",
    waybillNumber: "PX-7734190LK",
    estimatedDelivery: "Delivered on Nov 22, 2026",
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "Paid",
    total: 42500,
    items: [
      {
        product: MOCK_PRODUCTS[2], // Critical Mass
        flavorOrVariant: "Vanilla Ice Cream • 6 kg",
        quantity: 1,
        price: 29500,
        batchNumber: "LOT# 519022-EXP27",
      },
      {
        product: MOCK_PRODUCTS[7], // Applied Nutrition ABE
        flavorOrVariant: "Energy Flavour • 315g",
        quantity: 1,
        price: 13000,
        batchNumber: "LOT# 889210-EXP27",
      },
    ],
    timeline: [
      {
        id: "ev_301",
        timestamp: "3:45 PM · Nov 22, 2026",
        location: "Mount Lavinia, Galle Road",
        title: "Delivered & Signed by Customer",
        description:
          "Package successfully handed over to Sachintha S. Cash on Delivery payment of Rs. 42,500 collected and verified.",
        isCompleted: true,
        isCurrent: true,
      },
      {
        id: "ev_302",
        timestamp: "1:20 PM · Nov 22, 2026",
        location: "Mount Lavinia Hub",
        title: "Out for Final Delivery",
        description: "Courier rider departed for customer destination.",
        isCompleted: true,
      },
      {
        id: "ev_303",
        timestamp: "9:30 AM · Nov 22, 2026",
        location: "Dehiwala / Mount Lavinia Station",
        title: "Arrived at Destination Hub",
        description: "Received from central warehouse van.",
        isCompleted: true,
      },
      {
        id: "ev_304",
        timestamp: "4:00 PM · Nov 21, 2026",
        location: "AuraFit Vault, Colombo 03",
        title: "Hologram Sealed & Dispatched",
        description: "Order packaged in double-reinforced tamper box.",
        isCompleted: true,
      },
      {
        id: "ev_305",
        timestamp: "11:00 AM · Nov 21, 2026",
        location: "AuraFit Online System",
        title: "Order Confirmed",
        description: "COD order verified via SMS dispatch notification.",
        isCompleted: true,
      },
    ],
  },
};

export function lookupTrackedOrder(orderId: string): TrackedOrderRecord | null {
  const normalized = orderId.trim().toUpperCase();

  // 1. Check pre-configured mock orders
  if (MOCK_TRACKED_ORDERS[normalized]) {
    return MOCK_TRACKED_ORDERS[normalized];
  }

  // 2. Check localStorage for dynamically placed checkout orders
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("aurafit_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const found = parsed.find((o: any) => o.orderId.toUpperCase() === normalized);
          if (found) {
            return {
              orderId: found.orderId,
              customerName: found.customerName,
              phone: found.phone,
              email: found.email,
              deliveryAddress: `${found.address}, ${found.city}`,
              city: found.city,
              district: found.district,
              status: "QR Hologram Sealed",
              currentStepIndex: 2,
              courierPartner: "AuraFit Express · PromptX Logistics",
              waybillNumber: `PX-${found.orderId.replace(/[^0-9]/g, "").padEnd(7, "0")}LK`,
              estimatedDelivery: "Tomorrow, 10:00 AM – 3:00 PM",
              paymentMethod: found.isKoko
                ? "KOKO Pay (3 Monthly Installments)"
                : found.paymentMethod === "card"
                ? "Credit / Debit Card (Online Paid)"
                : "Cash on Delivery (Pay to Courier)",
              paymentStatus: found.paymentMethod === "cod" ? "Pending COD" : "Paid",
              total: found.total,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              items: found.items.map((it: any) => ({
                product: it.product,
                flavorOrVariant: it.selectedFlavor || it.product.weight,
                quantity: it.quantity,
                price: it.product.price,
                batchNumber: "LOT# 094821-EXP28",
              })),
              timeline: [
                {
                  id: "dyn_1",
                  timestamp: "Just now",
                  location: "AuraFit Importer Vault, Colombo 03",
                  title: "QR Hologram Sealed & Staged for Dispatch",
                  description:
                    "Security seal attached and verified against customs clearance logs. Ready for morning courier pickup.",
                  isCompleted: true,
                  isCurrent: true,
                },
                {
                  id: "dyn_2",
                  timestamp: "10 mins ago",
                  location: "AuraFit Online System",
                  title: "Order Placed & Verified",
                  description: `Order successfully registered for express delivery to ${found.city}, ${found.district}.`,
                  isCompleted: true,
                },
              ],
            };
          }
        }
      }
    } catch {
      // fallback
    }
  }

  return null;
}

