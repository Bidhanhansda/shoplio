import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) => {
  const buttonStyles = {
    primary: "bg-primary-100 active:bg-primary-300",
    secondary: "bg-blue-100 active:bg-secondary",
    outline: "border border-grey-300 bg-transparent active:primary-300",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full py-3 rounded-full items-center justify-center ${
        buttonStyles[variant]
      } ${disabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text
          className={`text-lg font-rubik-semibold ${
            variant === "outline" ? "primary-300" : "text-white"
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
