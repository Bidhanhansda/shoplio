import { Image, ImageSourcePropType, Text, View } from "react-native";

const CustomTabIcon = ({
    focused,
    icon,
    title,
  }: {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
  }) => (
    <View className="flex-1 mt-3 flex flex-col items-center justify-center">
      {focused && <View className="w-12 border border-primary-300 rounded-md mb-4 "/>}
      {!focused && <View className=" border border-transparent mb-4 "/>}
      <Image
        source={icon}
        tintColor={focused ? "#0061FF" : "#666876"}
        resizeMode="contain"
        className="size-6"
      />
      <Text
        className={`${
          focused
            ? "text-primary-300 font-rubik-medium"
            : "text-black-200 font-rubik"
        } text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );

  export default CustomTabIcon;