import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: keyof typeof Feather.glyphMap;
  color?: string;
  onPress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StatCard({ title, value, trend, icon, color, onPress }: StatCardProps) {
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

  const iconColor = color || theme.primary;
  const trendColor = trend && trend > 0 ? theme.success : trend && trend < 0 ? theme.error : theme.textSecondary;

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
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <ThemedText type="h1" style={[styles.value, { color: iconColor }]}>
        {value}
      </ThemedText>
      <ThemedText type="small" style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
      {trend !== undefined ? (
        <View style={styles.trendContainer}>
          <Feather
            name={trend > 0 ? "trending-up" : trend < 0 ? "trending-down" : "minus"}
            size={14}
            color={trendColor}
          />
          <ThemedText type="small" style={[styles.trendText, { color: trendColor }]}>
            {Math.abs(trend)}%
          </ThemedText>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  value: {
    marginBottom: Spacing.xs,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  trendText: {
    fontWeight: "500",
  },
});
