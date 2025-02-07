import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/utils/types/cartTypes";

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart:(state, action:PayloadAction<CartItem>)=>{
            const existingItem = state.items.find((item)=> item.id === action.payload.id);

            if(existingItem) {
                existingItem.quantity += action.payload.quantity;
            }else{
                state.items.push(action.payload);
            }

            state.totalQuantity += action.payload.quantity;
            state.totalPrice += action.payload.price * action.payload.quantity;
        },
        removeFromCart:(state, action:PayloadAction<number>)=>{
            const existingItemIndex = state.items.findIndex((item)=> item.id === action.payload);

            if(existingItemIndex !== -1) {
                const item = state.items[existingItemIndex];
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(existingItemIndex, 1);
            }

        },
        updateQuantity:(state, action:PayloadAction<{id:number; quantity:number}>)=>{
            const item = state.items.find((item)=> item.id === action.payload.id);

            if(item){
                item.quantity = action.payload.quantity;
                state.totalQuantity = state.items.reduce((acc, curr)=> acc + curr.quantity, 0);
                state.totalPrice = state.items.reduce((acc, curr)=> acc + curr.price * curr.quantity, 0);
            }
        },
        clearCart:(state)=>{
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        }

    }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;