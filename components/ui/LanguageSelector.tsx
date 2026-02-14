import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANGUAGES } from "@/constants/settings";
import Typo from "../ui/Typo";
import AppButton from "../ui/AppButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItemType } from "../ui/ListScreen";
import { clsx } from "clsx";
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";

type LanguageSelectorProps = {
  item: ListItemType; // Item data passed from ListScreen
};

const LanguageSelector = ({ item }: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]); // Default to English
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "75%"], []); // Adjust snap points as needed

  const handleSelectLanguage = (language: typeof LANGUAGES[0]) => {
    setSelectedLanguage(language);
    bottomSheetRef.current?.close();
    // You might want to save this preference globally or trigger an action here
  };

  const handleSheetChanges = useCallback((index: number) => {
    // Optionally handle changes if needed
  }, []);

  const renderLanguageItem = useCallback(({ item: langItem }) => (
    <TouchableOpacity
      onPress={() => handleSelectLanguage(langItem)}
      className="flex-row items-center justify-between p-4 my-1 bg-surface rounded-lg" // Using bg-surface
    >
      <Typo className="text-text-primary">{langItem.name}</Typo> {/* Using text-text-primary */}
      {selectedLanguage.code === langItem.code && (
        <Ionicons name="checkmark-circle" size={24} color="#0EA5E9" />
      )}
    </TouchableOpacity>
  ), [selectedLanguage]);

  // The visual representation of the list item
  return (
    <>
      <TouchableOpacity
        onPress={() => bottomSheetRef.current?.snapToIndex(0)}
        className={clsx(
          "flex-row items-center p-2",
          // The ListItem component inside ListScreen adds a border-b, so we don't need it here
        )}
      >
        {item.icon && (
          <View
            className="w-10 h-10 rounded-lg items-center justify-center mr-4"
            style={{ backgroundColor: "#0EA5E91A" }} // Primary color with 10% opacity
          >
            <Ionicons name={item.icon} size={20} color="#0EA5E9" /> {/* Using primary color */}
          </View>
        )}
        <View className="flex-1">
          <Typo className="font-sans text-text-primary">{item.title}</Typo> {/* Using text-text-primary */}
          <Typo size={12} className="text-text-secondary mt-1">{selectedLanguage.name}</Typo> {/* Using text-text-secondary */}
        </View>
        <Ionicons name="chevron-forward" size={22} color="#9CA3AF" /> {/* Using muted color for chevron */}
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Hidden by default
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: '#F0F8FF', borderRadius: 20 }} // Use background color
        handleIndicatorStyle={{ backgroundColor: '#E0F2F7' }} // Use border color
      >
        <BottomSheetView style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 px-4">
          <View className="flex-row items-center justify-between py-4">
            <Typo size={20} className="font-bold text-text-primary">Select Language</Typo> {/* Using text-text-primary */}
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <Ionicons name="close-circle" size={30} color="#9CA3AF" /> {/* Using muted color */}
            </TouchableOpacity>
          </View>

          <BottomSheetFlatList
            data={LANGUAGES}
            keyExtractor={(langItem) => langItem.code}
            renderItem={renderLanguageItem}
            showsVerticalScrollIndicator={false}
          />

          <View className="my-4">
             <AppButton title="Close" onPress={() => bottomSheetRef.current?.close()} className="bg-primary" /> {/* Using bg-primary */}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default LanguageSelector;
