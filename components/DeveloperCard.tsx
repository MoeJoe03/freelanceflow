import React from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Badge } from "@/components/Badge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Developer } from "@/store/dataStore";

// Import avatars directly to ensure they're bundled
import avatarGeometric from "../assets/images/avatars/avatar-geometric.png";
import avatarWorkspace from "../assets/images/avatars/avatar-workspace.png";
import avatarDeveloper from "../assets/images/avatars/avatar-developer.png";

const avatarImages = [
  avatarGeometric,
  avatarWorkspace,
  avatarDeveloper,
];

interface DeveloperCardProps {
  developer: Developer;
  onPress: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DeveloperCard({ developer, onPress }: DeveloperCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const avatarIndex = developer.avatar !== undefined ? developer.avatar % 3 : 0;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <Image
        source={avatarImages[avatarIndex]}
        style={styles.avatar}
        resizeMode="cover"
      />
      <ThemedText type="h4" numberOfLines={1} style={styles.name}>
        {developer.name}
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary }}
        numberOfLines={1}
      >
        {developer.role}
      </ThemedText>
      <View style={styles.rateRow}>
        <Feather name="dollar-sign" size={14} color={theme.success} />
        <ThemedText type="body" style={[styles.rate, { color: theme.success }]}>
          {developer.hourlyRate}/hr
        </ThemedText>
      </View>
      <Badge type="availability" value={developer.availability} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    gap: Spacing.xs,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: Spacing.sm,
  },
  name: {
    textAlign: "center",
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  rate: {
    fontWeight: "600",
  },
});
