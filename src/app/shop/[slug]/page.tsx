import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!product) {
    return {
      title: "Product Not Found | AuraFit.lk",
    };
  }

  return {
    title: `${product.name} | AuraFit.lk`,
    description: `Buy authentic ${product.name} by ${product.brand} in Sri Lanka. 100% genuine with laboratory QR batch verification. Islandwide express courier delivery.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-[#09090B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main 2-Column Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Studio Gallery (6 cols) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Pricing, Selectors & Actions (6 cols) */}
          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabbed In-Depth Information (Facts, Benefits, How-to-Verify, Reviews) */}
        <ProductTabs product={product} />

        {/* Compatible & Related Products */}
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
}

