import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import CustomButton from "./CustomButton";

interface AlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const CustomAlertBox: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  const scaleValue = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Animated.View className="w-80 bg-white p-6 rounded-2xl shadow-lg">
          <Text className="text-xl font-rubik-bold text-gray-900 text-center">
            {title}
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2">
            {message}
          </Text>

          <View className="flex-row mt-5 space-x-3 gap-2">
            <TouchableOpacity
              className="flex-1 bg-primary-200 rounded-full py-2"
              onPress={onClose}
            >
              <Text className="text-center font-rubik-semibold text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                className="flex-1 bg-primary-300 rounded-full py-2"
                onPress={onConfirm}
              >
                <Text className="text-center font-rubik-semibold text-white">
                  Confirm
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlertBox;
