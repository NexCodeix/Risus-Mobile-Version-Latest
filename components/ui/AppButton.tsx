import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";

/* ================= TYPES ================= */

type AppButtonProps = {
    title: string;                  // Button text
    onPress: () => void;             // Action handler
    loading?: boolean;               // Show spinner
    disabled?: boolean;              // Disable button
    className?: string;       // Optional container style
};

/* ================= COMPONENT ================= */

export default function AppButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    className,
}: AppButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={isDisabled}
            className={`bg-primary py-3 px-5 rounded-lg ${isDisabled ? "text-text-muted" : "text-text-primary"} ${className}`}
        >
            {loading ? (
                <ActivityIndicator color="black" />
            ) : (
                <Text className="text-text-primary font-semibold">
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}