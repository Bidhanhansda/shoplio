import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { checkStoredUser, loginUser } from "@/app/(redux)/authSlice";
import images from "@/constants/images";
import CustomAlertBox from "@/components/CustomAlert";

const Auth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [loggingIn, setLoggingIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    dispatch(checkStoredUser());
  }, [dispatch]);

  if (!loading && user) return <Redirect href="/" />;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    setLoggingIn(true);
    try {
      await dispatch(loginUser({ username, password })).unwrap();
    } catch (err) {
      // Alert.alert("Login Failed", err as string);
      setAlertVisible(true);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 60}
              className="flex-1 justify-center"
            >
              <Image
                source={images.splash}
                className="w-full h-2/6"
                resizeMode="contain"
              />
              <View className="px-10">
                <Text className="text-base text-center uppercase font-rubik text-black-200">
                  Welcome To {"\t"}
                  <Text className="text-primary-300">ShopLio</Text> 
                </Text>

                <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
                Shopping Has {"\n"}
                  <Text className="text-primary-300">Never Been Easier</Text>
                </Text>

                {error && (
                  <Text className="text-red-500 text-center mt-2">{error}</Text>
                )}

                <View className="mt-5">
                  <Text className="text-lg font-rubik-medium text-black-300 mb-1">
                    Username
                  </Text>
                  <TextInput
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => setIsUsernameFocused(false)}
                    className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-black-300"
                    placeholderTextColor="#9CA3AF"
                    style={{
                      borderWidth: 2,
                      borderColor: isUsernameFocused ? "#0061FF" : "#D1D5DB",
                    }}
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-lg font-rubik-medium text-black-300 mb-1">
                    Password
                  </Text>
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)} 
                    secureTextEntry
                    className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-black-300"
                    placeholderTextColor="#9CA3AF"
                    style={{
                      borderWidth: 2,
                      borderColor: isPasswordFocused ? "#0061FF" : "#D1D5DB",
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  className="bg-primary-300 rounded-full w-full py-4 mt-5 flex flex-row items-center justify-center shadow-md shadow-zinc-300"
                  disabled={loggingIn}
                >
                  {loggingIn ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text className="text-lg font-rubik-medium text-white">
                      Login
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      <CustomAlertBox
        visible={isAlertVisible}
        title="Error While Logging"
        message={`${error} ${"\n"} Try Username: emilys , Password: emilyspass`}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          setAlertVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Auth;
