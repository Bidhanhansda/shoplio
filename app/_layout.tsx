import { router, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Provider, useSelector } from "react-redux";
import store from "./(redux)/store";
import { loadUserFromStorage } from "@/utils/userAsyncStorage";
import { RootState } from "./(redux)/store";
import { checkStoredUser } from "./(redux)/authSlice";
import { useAppDispatch } from "@/hooks/hooks";

import "./globals.css";

SplashScreen.preventAutoHideAsync();

function AuthLoader() {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const loadApp = async () => {
      const storedUser = await loadUserFromStorage();
      if (storedUser) {
        dispatch(checkStoredUser());
      }
      setAppReady(true);
    };

    loadApp();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (appReady && !user) {
      router.replace("/auth/login");
    }
  }, [appReady, user]);

  if (!appReady) return null;

  return <Stack screenOptions={{headerShown:false}} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthLoader />
    </Provider>
  );
}
