import AppButton from "@/components/ui/AppButton";
import { AppToast } from "@/components/ui/AppToast";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const handleClick = () => {
    AppToast.success({ title: "Hey there!", description: "i am good now" })
    // Toast.show({ text1: "hello" })
  }
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-700">
        Welcome to Nativewind!
      </Text>
      <AppButton
        title="Hey There!"
        onPress={() => handleClick()}
      />
    </View>
  );
}