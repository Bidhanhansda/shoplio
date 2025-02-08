import { CartItem } from "./cartTypes";

export interface OrderedItem extends CartItem {
    orderDate: string;
    status: string;
  }

export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    orderDate: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  }

  export interface OrderState {
    orders: Order[];
    allOrderItems:OrderedItem[]
  }