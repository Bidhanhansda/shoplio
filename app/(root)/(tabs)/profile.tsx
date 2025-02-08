import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { logout } from "@/app/(redux)/authSlice";
const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  

  return (
    user ?
    <View className="flex-1 bg-gray-100 px-5 py-10">
      <View className="items-center mb-8">
        <Image
          source={{ uri: user.image }}
          className="w-24 h-24 rounded-full border-2 border-primary-300"
        />
        <Text className="text-xl font-semibold mt-3">{user.firstName}{user.lastName}</Text>
        <Text className="text-gray-500">{user.email}</Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/orders/orderlist")}
        className="bg-primary-300 flex-row items-center justify-center py-3 rounded-xl shadow-md"
      >
        <Ionicons name="list-outline" size={22} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => dispatch(logout())}
        className="mt-6 bg-red-500 flex-row items-center justify-center py-3 rounded-xl shadow-md"
      >
        <Ionicons name="log-out-outline" size={22} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">Logout</Text>
      </TouchableOpacity>
    </View>
    :null
  );
};

export default ProfileScreen;
