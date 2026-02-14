import React from 'react';
import { View, ImageStyle } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import Typo from './Typo'; // Assuming Typo is available for fallback text if needed

type AvatarProps = {
  source?: ImageSource | string | null;
  size?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  className?: string;
  fallbackIcon?: React.ComponentProps<typeof Ionicons>['name'];
  fallbackText?: string;
  fallbackTextColor?: string;
  fallbackBackgroundColor?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 40,
  borderRadius,
  borderColor = '#E0F2F7', // Default border color (border from theme)
  borderWidth = 0,
  className,
  fallbackIcon = 'person',
  fallbackText,
  fallbackTextColor = '#1F2937', // text-primary from theme
  fallbackBackgroundColor = '#E0F2F7', // border from theme
}) => {
  const avatarStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: borderRadius !== undefined ? borderRadius : size / 2, // Default to circle
    borderColor: borderColor,
    borderWidth: borderWidth,
    overflow: 'hidden',
  };

  const hasImage = source !== null && source !== undefined && (typeof source === 'string' ? source.length > 0 : true);

  return (
    <View className={clsx(className)} style={avatarStyle}>
      {hasImage ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: fallbackBackgroundColor,
          }}
        >
          {fallbackIcon && !fallbackText ? (
            <Ionicons name={fallbackIcon} size={size * 0.6} color={fallbackTextColor} />
          ) : fallbackText ? (
            <Typo style={{ color: fallbackTextColor, fontSize: size * 0.4 }} className="font-bold">
              {fallbackText.substring(0, 1).toUpperCase()}
            </Typo>
          ) : (
            <Ionicons name="person" size={size * 0.6} color={fallbackTextColor} />
          )}
        </View>
      )}
    </View>
  );
};

export default Avatar;
