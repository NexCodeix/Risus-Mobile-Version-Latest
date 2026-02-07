import AppButton from "@/components/ui/AppButton";
import AppScreen from "@/components/ui/AppScreen";
import { AppToast } from "@/components/ui/AppToast";
import { Text, View } from "react-native";

export default function Index() {
  const handleClick = () => {
    AppToast.success({ title: "Hey there!", description: "i am good now" })
  }
  return (
    <AppScreen>
      <View className="flex-1 items-center justify-center bg-white gap-5">
        <Text className="text-xl font-bold text-blue-700">
          Welcome to Nativewind!
        </Text>
        <AppButton
          title="Success Toast"
          onPress={() => handleClick()}
        />
        <AppButton
          title="Error Toast"
          onPress={() => AppToast.error({ title: "Error", description: "This is error toast" })}
        />
        <AppButton
          title="Info Toast"
          className={"bg-black"}
          onPress={() => AppToast.info({ title: "Info", description: "This is info toast" })}
        />
      </View>
    </AppScreen>
  );
}