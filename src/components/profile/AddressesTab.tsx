"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2, Home, Building } from "lucide-react";
import { SRI_LANKAN_DISTRICTS } from "@/components/checkout/CheckoutForm";

interface Address {
  id: string;
  label: string;
  name: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr_1",
    label: "Home / Primary Residence",
    name: "Kasun Perera",
    address: "No. 45/2, Galle Road, Apartment 4B",
    city: "Kollupitiya",
    district: "Colombo",
    postalCode: "00300",
    phone: "77 123 4567",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Fitness Center Locker",
    name: "Kasun Perera",
    address: "Level 2, Colombo City Centre",
    city: "Colombo 02",
    district: "Colombo",
    postalCode: "00200",
    phone: "77 123 4567",
    isDefault: false,
  },
];

export default function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);

  const [newAddr, setNewAddr] = useState({
    label: "Gym / Work",
    name: "Kasun Perera",
    address: "",
    city: "",
    district: "Colombo",
    postalCode: "",
    phone: "77 123 4567",
  });

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address.trim() || !newAddr.city.trim()) return;

    const added: Address = {
      id: `addr_${Date.now()}`,
      ...newAddr,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, added]);
    setIsAdding(false);
    setNewAddr({
      label: "Office / Gym",
      name: "Kasun Perera",
      address: "",
      city: "",
      district: "Colombo",
      postalCode: "",
      phone: "77 123 4567",
    });
  };

  return (
    <div className="bg-[#141418] rounded-2xl border border-white/8 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your Sri Lankan doorstep delivery destinations for express courier dispatch
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all self-start sm:self-auto cursor-pointer font-heading"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add New Address Collapsible Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 rounded-2xl bg-[#0E0E12] border border-[#E2C275]/30 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              New Delivery Address
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Address Label</label>
              <input
                type="text"
                value={newAddr.label}
                onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                placeholder="e.g. Home, Office, Gym"
                className="w-full bg-[#141418] border border-white/12 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Recipient Name</label>
              <input
                type="text"
                value={newAddr.name}
                onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                className="w-full bg-[#141418] border border-white/12 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-zinc-300">Street Address</label>
              <input
                type="text"
                value={newAddr.address}
                onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                placeholder="e.g. No. 12, Kandy Road"
                className="w-full bg-[#141418] border border-white/12 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">City / Town</label>
              <input
                type="text"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                placeholder="e.g. Peradeniya"
                className="w-full bg-[#141418] border border-white/12 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">District</label>
              <select
                value={newAddr.district}
                onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })}
                className="w-full bg-[#141418] border border-white/12 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E2C275] cursor-pointer"
              >
                {SRI_LANKAN_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-[#141418] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-[#E2C275] hover:brightness-105 font-heading cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
              addr.isDefault
                ? "bg-[#1A1710] border-[#E2C275] ring-1 ring-[#E2C275]/30 shadow-lg"
                : "bg-[#0E0E12] border-white/8 hover:border-white/15"
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white font-heading">
                {addr.label.toLowerCase().includes("home") ? (
                  <Home className="w-3.5 h-3.5 text-[#E2C275]" />
                ) : (
                  <Building className="w-3.5 h-3.5 text-[#E2C275]" />
                )}
                <span>{addr.label}</span>
              </span>

              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-[#09090B] bg-[#E2C275]">
                  Default
                </span>
              )}
            </div>

            {/* Address Details */}
            <div className="text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-white">{addr.name}</p>
              <p className="text-zinc-400">{addr.address}</p>
              <p className="text-zinc-400">
                {addr.city}, {addr.district} {addr.postalCode}
              </p>
              <p className="text-zinc-500 font-mono text-[11px] pt-1">+94 {addr.phone}</p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-zinc-400 hover:text-[#E2C275] flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Set as Default</span>
                </button>
              ) : (
                <span className="text-[11px] text-[#E2C275] font-semibold">
                  Primary Delivery
                </span>
              )}

              {addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  aria-label="Delete address"
                  className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
