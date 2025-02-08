import { Product } from "@/utils/types/productTypes";

export interface CartItem extends Product {
  quantity: number;
}
