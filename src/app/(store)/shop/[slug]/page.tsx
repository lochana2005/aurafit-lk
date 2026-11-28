import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main 2-Column Product Showcase with generous breathing room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Compact Studio Gallery (Sticky) */}
          <div className="lg:col-span-6 max-w-[540px] mx-auto w-full lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Pricing, Selectors & Actions */}
          <div className="lg:col-span-6 w-full">
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

