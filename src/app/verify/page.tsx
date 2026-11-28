"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, QrCode } from "lucide-react";
import VerificationConsole from "@/components/verify/VerificationConsole";
import VerificationResult from "@/components/verify/VerificationResult";
import HowToVerifySteps from "@/components/verify/HowToVerifySteps";
import TrustStatsStrip from "@/components/verify/TrustStatsStrip";
import { lookupBatch, BatchVerificationRecord } from "@/data/batchRegistry";
import { useToast } from "@/context/ToastContext";

function VerifyContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const initialCode = (searchParams.get("code") || "").trim().toUpperCase();

  const [searchedCode, setSearchedCode] = useState(initialCode);
  const [activeRecord, setActiveRecord] = useState<BatchVerificationRecord | null>(() => {
    if (!initialCode) return null;
    return lookupBatch(initialCode);
  });
  const [isNotFound, setIsNotFound] = useState(() => {
    if (!initialCode) return false;
    return lookupBatch(initialCode) === null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (code: string) => {
    setSearchedCode(code.trim().toUpperCase());
    setIsLoading(true);
    setIsNotFound(false);
    setActiveRecord(null);

    // Realistic verification lookup delay (800ms)
    setTimeout(() => {
      const found = lookupBatch(code);
      setIsLoading(false);

      if (found) {
        setActiveRecord(found);
        setIsNotFound(false);
        showToast({
          type: "cyan",
          title: "100% Authentic Batch Verified",
          subtitle: `Certificate of Analysis matched for ${found.batchNumber}.`,
        });

        // Save to user's verified history in localStorage so Profile can display it
        try {
          const saved = localStorage.getItem("aurafit_verified_batches");
          const parsed = saved ? JSON.parse(saved) : [];
          const newItem = {
            id: `v_${Date.now()}`,
            productName: `${found.product.name} (${found.product.weight})`,
            brand: found.product.brand,
            batchNumber: found.lotNumber,
            certificateRef: found.certificateRef,
            labResult: `${found.proteinAssay.split("(")[0].trim()} • Zero Heavy Metals Detected`,
            verificationDate: "Just now",
            verifiedBy: "AuraFit Importer Assay Lab",
          };
          const updated = [
            newItem,
            ...parsed.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (item: any) => item.certificateRef !== found.certificateRef
            ),
          ];
          localStorage.setItem("aurafit_verified_batches", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save verified batch", e);
        }
      } else {
        setIsNotFound(true);
        showToast({
          type: "error",
          title: "Batch Code Not Found",
          subtitle: `No official AuraFit lab record matched ${code.trim().toUpperCase()}.`,
        });
      }
    }, 800);
  };

  const handleReset = () => {
    setActiveRecord(null);
    setIsNotFound(false);
    setSearchedCode("");
  };

  return (
    <div className="w-full min-h-screen bg-[#09090B] text-white">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-12">
        {/* =========================================================================
            BREADCRUMBS
            ========================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-sky-300 font-semibold">Product Authenticity &amp; Batch Verification</span>
        </nav>

        {/* =========================================================================
            PAGE HEADER
            ========================================================================= */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-950/50 border border-sky-400/35 text-xs font-semibold text-sky-300 font-heading uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            <span>Authenticity Vault · Lab Verified</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
            VERIFY YOUR{" "}
            <span className="bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#B08922] bg-clip-text text-transparent">
              SUPPLEMENT
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Every genuine tub imported by AuraFit.lk carries a unique tamper-evident holographic QR
            seal linked to Sri Lanka Customs clearances and manufacturer laboratory assay certificates.
          </p>
        </div>

        {/* =========================================================================
            MAIN INTERACTIVE SCANNER & INPUT HUB
            ========================================================================= */}
        <VerificationConsole
          onVerify={handleVerify}
          isLoading={isLoading}
          initialCode={initialCode}
        />

        {/* =========================================================================
            VERIFICATION RESULT DISPLAY (Loading / Authentic / Counterfeit Warning)
            ========================================================================= */}
        {(isLoading || activeRecord || isNotFound) && (
          <VerificationResult
            record={activeRecord}
            searchedCode={searchedCode}
            isNotFound={isNotFound}
            isLoading={isLoading}
            onReset={handleReset}
          />
        )}

        {/* =========================================================================
            3-STEP HOW TO VERIFY GUIDE
            ========================================================================= */}
        <div className="pt-6 border-t border-white/8">
          <HowToVerifySteps />
        </div>

        {/* =========================================================================
            TRUST STATS STRIP
            ========================================================================= */}
        <TrustStatsStrip />
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-500 font-heading tracking-widest text-sm uppercase">
          Loading Authenticity Vault...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
