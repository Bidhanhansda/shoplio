import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProducts } from "@/app/(redux)/productSlice";
import { ActivityIndicator } from "react-native";
import icons from "@/constants/icons";

const Home = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [category, setCategory] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    const productCategoryList = products.map(
      (product) =>
        product.category
    );
    const uniques = ["All", ...new Set(productCategoryList)];
    setCategory(uniques);
  }, [selectedCategory, products]);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  return (
    <SafeAreaView className="bg-white flex-1 px-4">
      <View className="flex-row items-center bg-gray-200 rounded-xl p-3 mt-2">
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 text-lg"
        />
      </View>

      <View className="flex-row justify-between items-center mt-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {category.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedCategory(item)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === item
                  ? "bg-primary-500 text-white"
                  : "bg-gray-200"
              } mx-1`}
            >
              <Text className="text-black">{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity className="bg-primary-500 px-4 py-2 rounded-lg bg-slate-100">
          <Image
            source={icons.filter}
            className="size-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" className="mt-5" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          className="mt-4"
          renderItem={({ item }) => (
            <View className="bg-gray-100 m-2 p-3 rounded-lg w-[48%]">
              <Image
                source={{ uri: item.thumbnail }}
                className="w-full h-24 rounded-lg"
              />
              <Text className="text-lg font-semibold mt-2">{item.title}</Text>
              <Text className="text-gray-500">${item.price}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
