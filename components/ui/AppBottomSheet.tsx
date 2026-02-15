/**
 * ReusableBottomSheet.tsx
 */

import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";

/* ================= TYPES ================= */

type AppBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: string[];
};

/* ================= COMPONENT ================= */

export default function AppBottomSheet({
  visible,
  onClose,
  children,
  snapPoints,
}: AppBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  /* ================= SNAP POINTS ================= */

  const finalSnapPoints = useMemo(
    () => snapPoints || ["85%"],
    [snapPoints]
  );

  /* ================= OPEN / CLOSE ================= */

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  /* ================= BACKDROP ================= */

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  /* ================= RENDER ================= */

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={finalSnapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: "#E5E7EB" }}
    >
      {children}
    </BottomSheetModal>
  );
}