import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderState } from "@/utils/types/orderTypes";
import { CartItem } from "@/utils/types/cartTypes";

const initialState: OrderState = {
  orders: [],
  allOrderItems: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: (
      state,
      action: PayloadAction<{ items: CartItem[]; totalAmount: number }>
    ) => {
      const orderDate = new Date().toISOString();
      const status = "pending";

      const newOrder: Order = {
        id: orderDate,
        items: action.payload.items,
        totalAmount: Number(action.payload.totalAmount.toFixed(2)),
        orderDate,
        status,
      };

      state.orders.push(newOrder);
      state.allOrderItems.push(
        ...action.payload.items.map((item) => ({
          ...item,
          orderDate,
          status, 
        }))
      );
    },

    cancelOrder: (state, action: PayloadAction<string>) => {
      const orderIndex = state.orders.findIndex(
        (order) => order.id === action.payload
      );

      if (orderIndex !== -1) {
        const cancelledOrder = state.orders[orderIndex];
        state.orders[orderIndex].status = "cancelled";
        state.allOrderItems = state.allOrderItems.map((item) =>
          item.orderDate === cancelledOrder.orderDate
            ? { ...item, status: "cancelled" }
            : item
        );
      }
    },
  },
});

export const { placeOrder, cancelOrder } = orderSlice.actions;
export default orderSlice.reducer;
