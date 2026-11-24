"use client";

import React from "react";
import { User, Mail, Phone, MapPin, Building, Home, FileText } from "lucide-react";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  district: string;
  postalCode: string;
  notes: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
}

export const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
] as const;

export default function CheckoutForm({
  formData,
  onChange,
  errors,
}: CheckoutFormProps) {
  return (
    <div className="space-y-8">
      {/* =========================================================================
          STEP 1: CONTACT INFORMATION
          ========================================================================= */}
      <section className="bg-[#141418] rounded-2xl border border-white/8 p-5 sm:p-7 shadow-lg space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/8">
          <div className="w-8 h-8 rounded-full bg-[#1C1C22] border border-[#E2C275]/40 flex items-center justify-center text-xs font-bold text-[#E2C275] font-mono">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading">
              Contact Information
            </h2>
            <p className="text-xs text-zinc-400">
              Order confirmation &amp; delivery tracking SMS will be sent here
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="e.g. Kasun Perera"
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                errors.fullName
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-400 pl-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="name@example.com"
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 pl-1">{errors.email}</p>
            )}
          </div>

          {/* Mobile Number with +94 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Mobile Number *</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-mono font-bold text-zinc-400 border-r border-white/10 pr-2 pointer-events-none">
                +94
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="77 123 4567"
                className={`w-full pl-16 pr-4 py-3 bg-[#0E0E12] border rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none font-mono transition-colors ${
                  errors.phone
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-white/12 focus:border-[#E2C275]"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-400 pl-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          STEP 2: ISLANDWIDE DELIVERY ADDRESS
          ========================================================================= */}
      <section className="bg-[#141418] rounded-2xl border border-white/8 p-5 sm:p-7 shadow-lg space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/8">
          <div className="w-8 h-8 rounded-full bg-[#1C1C22] border border-[#E2C275]/40 flex items-center justify-center text-xs font-bold text-[#E2C275] font-mono">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading">
              Delivery Address
            </h2>
            <p className="text-xs text-zinc-400">
              Delivered safely via PromptX or Domex Express with signature required
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Street Address */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Street Address *</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="e.g. No. 45/2, Galle Road"
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                errors.address
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            />
            {errors.address && (
              <p className="text-[11px] text-red-400 pl-1">{errors.address}</p>
            )}
          </div>

          {/* Apartment / Suite (Optional) */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-zinc-500" />
              <span>Apartment, Suite, Landmark (Optional)</span>
            </label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) => onChange("apartment", e.target.value)}
              placeholder="e.g. Level 4, Apartment 4B / Opposite Supermarket"
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>City / Town *</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="e.g. Kollupitiya / Kandy"
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors ${
                errors.city
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            />
            {errors.city && (
              <p className="text-[11px] text-red-400 pl-1">{errors.city}</p>
            )}
          </div>

          {/* District Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              District *
            </label>
            <select
              value={formData.district}
              onChange={(e) => onChange("district", e.target.value)}
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors cursor-pointer ${
                errors.district
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            >
              <option value="" disabled className="bg-[#141418] text-zinc-500">
                Select your District
              </option>
              {SRI_LANKAN_DISTRICTS.map((dist) => (
                <option
                  key={dist}
                  value={dist}
                  className="bg-[#141418] text-white py-1"
                >
                  {dist}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-[11px] text-red-400 pl-1">{errors.district}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Postal Code *
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => onChange("postalCode", e.target.value)}
              placeholder="e.g. 00300"
              className={`w-full bg-[#0E0E12] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none font-mono transition-colors ${
                errors.postalCode
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-white/12 focus:border-[#E2C275]"
              }`}
            />
            {errors.postalCode && (
              <p className="text-[11px] text-red-400 pl-1">{errors.postalCode}</p>
            )}
          </div>

          {/* Delivery Note (Optional) */}
          <div className="sm:col-span-2 space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span>Special Delivery Instructions (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="e.g. Please call before delivery, deliver after 2 PM..."
              className="w-full bg-[#0E0E12] border border-white/12 focus:border-[#E2C275] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

