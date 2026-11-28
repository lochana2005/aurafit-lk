"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#09090B] text-white flex overflow-hidden">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
        <main
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin"
        >
          <div className="max-w-[1440px] w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
