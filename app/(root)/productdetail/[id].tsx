import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Rating } from "react-native-ratings";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { setSelectedProduct } from "@/app/(redux)/productSlice";
import { Product } from "@/utils/types/productTypes";
import { useRouter } from "expo-router";
import { formatDate } from "@/utils/helperFunctions/dateFormater";
import icons from "@/constants/icons";
import { addToCart } from "@/app/(redux)/cartSlice";
import { CartItem } from "@/utils/types/cartTypes";
import CustomAlertBox from "@/components/CustomAlert";
import { placeOrder } from "@/app/(redux)/orderSlice";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { products, selectedProduct } = useAppSelector(
    (state) => state.products
  );
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const { items } = useAppSelector((state) => state.cart);
  const [itemInCart, setItemInCart] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false)
  const [orderPlacedAlert, setOrderPlacedAlert] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      dispatch(setSelectedProduct(id as string));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (items) {
      setItemInCart(items.some((item) => item.id === selectedProduct?.id));
    }
  }, [items, selectedProduct]);

  useEffect(() => {
    if (products && selectedProduct) {
      const similarProductArray = products.filter(
        (p) =>
          p.category === selectedProduct.category && p.id !== selectedProduct.id
      );
      setSimilarProducts(similarProductArray);
    }
  }, [products, selectedProduct]);

  const currentIndex = useSharedValue(0);

  useEffect(() => {
    if (selectedProduct) {
      const interval = setInterval(() => {
        currentIndex.value =
          (currentIndex.value + 1) % selectedProduct.images.length;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedProduct]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: currentIndex.value * width }],
  }));
  const increaseQuantity = () =>
    setQuantity((prev) => (prev < 10 ? prev + 1 : prev));
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const cartItem: CartItem = { ...selectedProduct, quantity };

    dispatch(addToCart(cartItem));
    setAlertVisible(true);
  };

  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setSelectedImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  const createOrder = () => {
    if(selectedProduct){
      const cartItem: CartItem = { ...selectedProduct, quantity };
     dispatch(placeOrder({ items:[cartItem], totalAmount: selectedProduct?.price * quantity }))
      setOrderPlaced(false);
      setOrderPlacedAlert(true);
    }
  }

  return selectedProduct ? (
    <View className="flex-1 relative">
      <TouchableOpacity
        className="absolute top-2 left-5 z-10 bg-white p-1 rounded-full shadow-lg"
        onPress={() => router.back()}
      >
        <Image source={icons.backArrow} />
      </TouchableOpacity>
      <FlatList
        data={selectedProduct.reviews}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <Image
              source={{ uri: selectedImage || "https://placehold.co/600x400/png" }}
              className="w-full h-72 rounded-lg"
              resizeMode="contain"
            />

            <FlatList
              data={selectedProduct.images}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              className="mt-3 px-4"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedImage(item)}
                  className="m-2 border border-gray-300 p-1 rounded-lg"
                >
                  <Image
                    source={{ uri: item }}
                    className="w-16 h-16 rounded-lg"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />

            <View className="p-4">
              <Text className="text-2xl font-bold">
                {selectedProduct.title}
              </Text>
              <View className="flex-row items-center mt-2">
                <Rating
                  imageSize={20}
                  readonly
                  startingValue={selectedProduct.rating}
                />
                <Text className="ml-2 text-lg">
                  {selectedProduct.rating} / 5
                </Text>
              </View>
            </View>

            <Text className="px-4 text-lg text-gray-700">
              {selectedProduct.description}
            </Text>

            <Text className="text-xl font-semibold px-4 mt-6">
              Similar Products
            </Text>

            <View>
              <FlatList
                horizontal
                data={similarProducts}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                className="mt-3 px-4"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/productdetail/${item.id.toString()}`)
                    }
                    className="bg-gray-100 p-3 m-2 rounded-lg w-40"
                  >
                    <Image
                      source={{ uri: item.thumbnail }}
                      className="w-full h-24 rounded-lg"
                    />
                    <Text className="mt-2 text-center">{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <Text className="text-xl font-semibold px-4 mt-6">
              Customer Reviews
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 mb-3 rounded-lg shadow-sm gap-3">
            <View className="flex-row justify-between">
              <View className="">
                <Text className="font-semibold">{item.reviewerName}</Text>
                <Rating
                  imageSize={16}
                  readonly
                  startingValue={item.rating}
                  style={{ backgroundColor: "#f3f4f6" }}
                />
              </View>
              <Text className="text-gray-500">{formatDate(item.date)}</Text>
            </View>
            <Text className="mt-2 text-gray-700">{item.comment}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="absolute bottom-[20] bg-white p-4 flex-row items-center justify-between w-[90%] self-center mx-[10%] h-[80] rounded-3xl shadow-slate-900 elevation-sm gap-2 ">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={decreaseQuantity}
            className="p-2 bg-gray-200 rounded-lg"
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text className="mx-4 text-lg font-semibold">{quantity}</Text>
          <TouchableOpacity
            onPress={increaseQuantity}
            className="p-2 bg-gray-200 rounded-lg"
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            style={itemInCart ? { backgroundColor: "grey" } : {}}
            className="bg-cyan-200 rounded-full flex flex-row items-center justify-center shadow-md shadow-zinc-300 px-5 py-2"
            onPress={handleAddToCart}
            disabled={itemInCart}
          >
            <Text className="text-black text-lg font-semibold">
              Add to Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary-300 rounded-full flex flex-row items-center justify-center shadow-md shadow-zinc-300 px-5 py-2"
          onPress={()=>setOrderPlaced(true)}
          >
            <Text className="text-white text-lg font-semibold">Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <CustomAlertBox
          visible={isAlertVisible}
          title="Success!"
          message={"Product has been successfully added"}
          onClose={() => setAlertVisible(false)}
          buttonType="Close"
        />
        <CustomAlertBox
        visible={orderPlaced}
        title="Place Order!"
        message={`Do you want to place this order?`}
        onClose={() => setOrderPlaced(false)}
        onConfirm={() => {
          createOrder()
        }}
      />
      <CustomAlertBox
        visible={orderPlacedAlert}
        title="Order Placed !"
        message={`Your order has been placed successfully !! 🎉`}
        onClose={() => setOrderPlacedAlert(false)}
        onConfirm={() => {
          setOrderPlacedAlert(false)
          router.push("/orders/orderlist");
        }}
      />
      </View>
    </View>
  ) : null;
};

export default ProductDetails;
