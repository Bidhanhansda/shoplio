import { useAppSelector } from "@/hooks/hooks";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user, loading, error } = useAppSelector((state) => state.auth);
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  if (!user && !loading) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/home" />;
  ;
}
