import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./types/userTypes";

const USER_KEY = "userData";


export const setUserInStorage = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const loadUserFromStorage = async (): Promise<User | null> => {
  try {
    const userJSON = await AsyncStorage.getItem(USER_KEY);
    return userJSON ? (JSON.parse(userJSON) as User) : null;
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};

export const removeUserFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};
