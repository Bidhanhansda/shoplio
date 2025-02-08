import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from "react-native";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { removeFromCart, clearCart } from "@/app/(redux)/cartSlice";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import CustomAlertBox from "@/components/CustomAlert";
import { placeOrder } from "@/app/(redux)/orderSlice";

const CartScreen = () => {
  const { items, totalQuantity, totalPrice } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [clearCartAlert, setClearCartAlert] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handlePlaceOrder = () => {
    dispatch(placeOrder({ items, totalAmount: totalPrice }));
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  return (
    <View className="flex-1 relative">
      <TouchableOpacity 
        className="absolute top-2 left-5 z-10 bg-white p-1 rounded-full shadow-lg"
        onPress={() => router.back()}
      >
        <Image source={icons.backArrow} />
      </TouchableOpacity>
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-rubik-semibold text-center mb-4">🛒 MY CART</Text>

      {items.length === 0 ? (
        <Text className="text-center text-gray-500 text-lg mt-10">Your cart is empty.</Text>
      ) : (
        <FlatList
          data={[...items].reverse()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-white p-3 rounded-lg shadow-md mb-3 flex-row items-center"
            onPress={() =>
              router.push(`/productdetail/${item.id.toString()}`)
            }
            >
              <Image source={{ uri: item.thumbnail }} className="w-16 h-16 rounded-lg mr-3" />
              <View className="flex-1">
                <Text className="text-lg font-rubik-semibold">{item.title}</Text>
                <Text className="text-gray-500">${item.price.toFixed(2)} x {item.quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)} className="bg-red-500 px-3 py-2 rounded-2xl">
                <Text className="text-white font-rubik-semibold">Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      {items.length > 0 && (
        <View className="mt-4 p-4 bg-white rounded-xl shadow-lg elevation-sm">
          <View className="flex-row mt-4 justify-between">
          <Text className="text-lg font-rubik-semibold">Total Items: {totalQuantity}</Text>
          <Text className="text-xl font-rubik-bold">Total: ${totalPrice.toFixed(2)}</Text>
        </View>
          <View className="flex-row mt-4 justify-between">
            <TouchableOpacity onPress={()=>setClearCartAlert(true)} className="bg-red-500 rounded-full flex flex-row items-center justify-center shadow-md shadow-zinc-300 px-5 py-4">
              <Text className="text-white font-rubik-semibold">CLEAR CART</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlaceOrder} className="bg-primary-300 rounded-full flex flex-row items-center justify-center shadow-md shadow-zinc-300 px-5 py-4">
              <Text className="text-white font-rubik-semibold">{"CHECK OUT >>>"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    <View>
    <CustomAlertBox
        visible={clearCartAlert}
        title="Clear Cart!"
        message={`Are you sure you want to empty your cart?`}
        onClose={() => setClearCartAlert(false)}
        onConfirm={() => {
          dispatch(clearCart())
          setClearCartAlert(false)
        }}
      />
    <CustomAlertBox
        visible={orderPlaced}
        title="Order Placed !"
        message={`Your order has been placed successfully !! 🎉`}
        onClose={() => setOrderPlaced(false)}
        onConfirm={() => {
          setOrderPlaced(false)
          router.push("/orders/orderlist");
        }}
      />
    </View>
    </View>
  );
};

export default CartScreen;
