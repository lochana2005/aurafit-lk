import { Product, MOCK_PRODUCTS } from "./mockProducts";

export interface BatchVerificationRecord {
  batchNumber: string;
  product: Product;
  manufacturer: string;
  countryOfOrigin: string;
  clearanceDetails: string;
  manufactureDate: string;
  expiryDate: string;
  lotNumber: string;
  certificateRef: string;
  proteinAssay: string;
  heavyMetalsStatus: "PASS" | "FAIL";
  microbialStatus: "PASS" | "FAIL";
  sealStatus: string;
  labName: string;
  analystSignature: string;
  testDate: string;
}

export const BATCH_REGISTRY: Record<string, BatchVerificationRecord> = {
  "AF-ON-8842": {
    batchNumber: "AF-ON-8842",
    product: MOCK_PRODUCTS[0], // Optimum Nutrition Gold Standard Isolate
    manufacturer: "Glanbia Performance Nutrition, Aurora, IL, USA",
    countryOfOrigin: "United States of America",
    clearanceDetails: "Sri Lanka Customs · Colombo Port · Cleared Oct 2026",
    manufactureDate: "August 2026",
    expiryDate: "August 2028",
    lotNumber: "LOT# 094821-EXP28",
    certificateRef: "COA-AF-ON-94821",
    proteinAssay: "100.8% of label claim (25.2g active protein per 25g serving)",
    heavyMetalsStatus: "PASS",
    microbialStatus: "PASS",
    sealStatus: "Tamper-Evident Holographic Seal Intact",
    labName: "Eurofins Scientific & AuraFit QA Bio-Analytical Lab",
    analystSignature: "Dr. H. M. Wickramasinghe, Lead Biochemist",
    testDate: "October 14, 2026",
  },
  "AF-MT-5190": {
    batchNumber: "AF-MT-5190",
    product: MOCK_PRODUCTS[2], // Applied Nutrition Critical Mass Professional
    manufacturer: "Applied Nutrition Ltd, Acornfield Rd, Liverpool, UK",
    countryOfOrigin: "United Kingdom",
    clearanceDetails: "Sri Lanka Customs · Air Cargo Osu Sala Approved · Nov 2026",
    manufactureDate: "September 2026",
    expiryDate: "December 2027",
    lotNumber: "LOT# 519022-EXP27",
    certificateRef: "COA-AF-AN-51902",
    proteinAssay: "99.8% of label claim (54.9g active protein per 55g serving)",
    heavyMetalsStatus: "PASS",
    microbialStatus: "PASS",
    sealStatus: "AuraFit Security Hologram Verified",
    labName: "LGC Informed-Sport UK & AuraFit Verification Lab",
    analystSignature: "Marcus Vance, Quality Assurance Director",
    testDate: "November 02, 2026",
  },
  "AF-DY-1192": {
    batchNumber: "AF-DY-1192",
    product: MOCK_PRODUCTS[1], // Dymatize ISO100 Hydrolyzed Whey
    manufacturer: "BellRing Brands / Dymatize Enterprises, Dallas, TX, USA",
    countryOfOrigin: "United States of America",
    clearanceDetails: "Sri Lanka Customs · Colombo Port · Cleared Sep 2026",
    manufactureDate: "July 2026",
    expiryDate: "July 2028",
    lotNumber: "LOT# 011928-EXP28",
    certificateRef: "COA-AF-DY-11928",
    proteinAssay: "100.2% of label claim (25.1g hydrolyzed whey isolate per serving)",
    heavyMetalsStatus: "PASS",
    microbialStatus: "PASS",
    sealStatus: "Tamper-Evident Holographic Seal Intact",
    labName: "Informed-Choice Certification & AuraFit Assay Lab",
    analystSignature: "Dr. R. Alahakoon, Head of Import Assurance",
    testDate: "September 28, 2026",
  },
  "AF-CR-4401": {
    batchNumber: "AF-CR-4401",
    product: MOCK_PRODUCTS[4], // Applied Nutrition Creatine Monohydrate
    manufacturer: "Applied Nutrition Ltd, Liverpool, UK",
    countryOfOrigin: "United Kingdom",
    clearanceDetails: "Sri Lanka Customs · Colombo Sea Freight · Cleared Nov 2026",
    manufactureDate: "October 2026",
    expiryDate: "October 2028",
    lotNumber: "LOT# 440118-EXP28",
    certificateRef: "COA-AF-CR-44011",
    proteinAssay: "100.0% Micronized Creatine Monohydrate (HPLC Purity 99.98%)",
    heavyMetalsStatus: "PASS",
    microbialStatus: "PASS",
    sealStatus: "AuraFit Security Hologram Verified",
    labName: "Quality Assurance Analytical Lab, UK",
    analystSignature: "Dr. K. Jayasuriya, Analytical Chemist",
    testDate: "November 05, 2026",
  },
};

export function lookupBatch(code: string): BatchVerificationRecord | null {
  const normalized = code.trim().toUpperCase();
  return BATCH_REGISTRY[normalized] || null;
}

