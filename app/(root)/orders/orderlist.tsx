import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { cancelOrder } from "@/app/(redux)/orderSlice";
import CustomAlertBox from "@/components/CustomAlert";
import { useState } from "react";
import icons from "@/constants/icons";

const OrderListScreen = () => {
  const orders = useAppSelector((state) => state.orders.orders);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  return (
    <View className="flex-1 p-4 bg-gray-100 relative">
      <TouchableOpacity
        className="absolute top-2 left-5 z-10 bg-white p-1 rounded-full shadow-lg"
        onPress={() => router.back()}
      >
        <Image source={icons.backArrow} />
      </TouchableOpacity>
      <Text className="text-2xl font-rubik-bold text-center mb-4">MY ORDERS</Text>

      {orders.length === 0 ? (
        <Text className="text-lg text-center text-gray-500">
          No orders found.
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id}
          renderItem={({ item: order }) => (
            <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
              <Text className="text-lg font-rubik-semibold">
                Order ID: {order.id}
              </Text>
              <Text className="text-gray-500">
                📅 {new Date(order.orderDate).toLocaleDateString()}
              </Text>
              <Text className="text-gray-700 font-rubik-medium">
                Status: {order.status}
              </Text>
              <Text className="text-gray-900 font-rubik-bold">
                Total: ${order.totalAmount.toFixed(2)}
              </Text>

              <FlatList
                data={order.items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="bg-gray-100 p-3 rounded-lg mt-2 flex-row items-center"
                    onPress={() =>
                      router.push(`/productdetail/${item.id.toString()}`)
                    }
                  >
                    <Image
                      source={{ uri: item.thumbnail }}
                      className="w-16 h-16 rounded-lg mr-3"
                    />
                    <View>
                      <Text className="font-rubik-semibold">{item.title}</Text>
                      <Text className="text-gray-600">
                        ${item.price} x {item.quantity}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                className={`mt-3 p-3 rounded-lg text-center ${
                  order.status === "cancelled" ? "bg-gray-400" : "bg-red-500"
                }`}
                disabled={order.status === "cancelled"}
                onPress={() => {
                  setSelectedOrderId(order.id);
                  setShowCancelAlert(true);
                }}
              >
                <Text className="text-white text-center font-rubik-bold">
                  {order.status === "cancelled"
                    ? "Order Cancelled"
                    : "Cancel Order"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <CustomAlertBox
        visible={showCancelAlert}
        title="Cancel Order!"
        message={`Are you sure you want to cancel your order?`}
        onClose={() => setShowCancelAlert(false)}
        onConfirm={() => {
          dispatch(cancelOrder(selectedOrderId));
          setShowCancelAlert(false);
        }}
      />
    </View>
  );
};

export default OrderListScreen;
