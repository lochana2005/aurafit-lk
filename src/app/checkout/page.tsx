"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Lock, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CheckoutForm, { CheckoutFormData } from "@/components/checkout/CheckoutForm";
import PaymentSelector, { PaymentMethod } from "@/components/checkout/PaymentSelector";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import OrderSuccess, { OrderConfirmationData } from "@/components/checkout/OrderSuccess";
import { getKokoTotal, getKokoInstallment } from "@/lib/pricing";

const FREE_SHIPPING_THRESHOLD = 25000;
const STANDARD_SHIPPING_FEE = 450;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    district: "",
    postalCode: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    percent: number;
  } | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] =
    useState<OrderConfirmationData | null>(null);

  // Field change handler
  const handleFormChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Promo handlers
  const handleApplyPromo = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === "AURA10") {
      setAppliedPromo({ code: "AURA10", percent: 10 });
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Delivery fee calculation
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;

  // Discount calculation
  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.percent) / 100)
    : 0;

  // Form Validation
  const validateForm = () => {
    const errors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name";
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = "Please enter a valid email address";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      errors.phone = "Please enter a valid 9-digit mobile number";
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter your delivery street address";
    }

    if (!formData.city.trim()) {
      errors.city = "Please enter your city/town";
    }

    if (!formData.district) {
      errors.district = "Please select your district";
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = "Please enter your postal code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Order Submission Handler
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      // Scroll to top of form
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury order creation & secure gateway communication
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const baseTotal = Math.max(0, subtotal - discountAmount + shippingFee);
    const isKoko = paymentMethod === "koko";
    const finalTotal = isKoko ? getKokoTotal(baseTotal) : baseTotal;
    const kokoInstallment = isKoko ? getKokoInstallment(baseTotal) : undefined;

    const orderRef = `AF-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const orderData: OrderConfirmationData = {
      orderId: orderRef,
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.apartment
        ? `${formData.address}, ${formData.apartment}`
        : formData.address,
      city: formData.city,
      district: formData.district,
      paymentMethod,
      total: finalTotal,
      items: [...items],
      isKoko,
      kokoInstallment,
    };

    setConfirmedOrder(orderData);
    setOrderPlaced(true);
    setIsSubmitting(false);

    // Save placed order to localStorage for live tracking and profile
    try {
      const existing = localStorage.getItem("aurafit_orders");
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem("aurafit_orders", JSON.stringify([orderData, ...parsed]));
    } catch {
      // fallback
    }

    // Clear cart in state and local storage
    clearCart();

    // Scroll to top to see confirmation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#09090B] text-white">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* =========================================================================
            BREADCRUMBS
            ========================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/cart" className="hover:text-white transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-[#E2C275] font-semibold">Secure Checkout</span>
        </nav>

        {/* If Order Placed: Render Order Confirmation */}
        {orderPlaced && confirmedOrder ? (
          <OrderSuccess order={confirmedOrder} />
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="py-16 sm:py-24 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#141418] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
              <ShoppingBag className="w-10 h-10 text-[#E2C275]" />
              <div className="absolute -inset-1 rounded-3xl bg-[#E2C275]/10 blur-xl -z-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white font-heading">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 mb-8 leading-relaxed">
              There are no authentic supplements in your cart to checkout. Explore our
              curated vault of genuine protein, creatine, and pre-workouts.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all font-heading"
            >
              <span>Return to Shop</span>
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        ) : (
          /* =========================================================================
              CHECKOUT FORM & SUMMARY 12-COLUMN GRID
              ========================================================================= */
          <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/8 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
                  SECURE{" "}
                  <span className="bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] bg-clip-text text-transparent">
                    CHECKOUT
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Complete your order with genuine import verification and guaranteed
                  express courier dispatch.
                </p>
              </div>

              {/* Security Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-950/40 border border-sky-400/30 text-sky-300 text-xs font-semibold self-start sm:self-auto">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>256-BIT SSL ENCRYPTED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* =========================================================================
                  LEFT COLUMN (7 COLS): CONTACT, DELIVERY & PAYMENT SELECTOR
                  ========================================================================= */}
              <div className="lg:col-span-7 space-y-8">
                {/* Step 1 & 2: Contact Info & Delivery Address */}
                <CheckoutForm
                  formData={formData}
                  onChange={handleFormChange}
                  errors={formErrors}
                />

                {/* Step 3: Payment Method */}
                <PaymentSelector
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                  subtotal={subtotal}
                />
              </div>

              {/* =========================================================================
                  RIGHT COLUMN (5 COLS): STICKY ORDER SUMMARY
                  ========================================================================= */}
              <div className="lg:col-span-5 lg:sticky lg:top-40 lg:self-start">
                <CheckoutSummary
                  items={items}
                  subtotal={subtotal}
                  shipping={shippingFee}
                  discountAmount={discountAmount}
                  appliedPromo={appliedPromo}
                  onApplyPromo={handleApplyPromo}
                  onRemovePromo={handleRemovePromo}
                  selectedPaymentMethod={paymentMethod}
                  isSubmitting={isSubmitting}
                  onSubmitOrder={handleSubmitOrder}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
