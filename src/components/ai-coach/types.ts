import { Product } from "@/data/mockProducts";

export interface StackItem {
  product: Product;
  timingBadge: string;
  dosageNote: string;
}

export interface RecommendedStack {
  items: StackItem[];
  title: string;
  rationale: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  recommendedProducts?: Product[];
  recommendedStack?: RecommendedStack;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: number;
  messages: ChatMessage[];
  recommendedStack?: RecommendedStack;
}
