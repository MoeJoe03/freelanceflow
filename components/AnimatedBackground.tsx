import React from "react";
import { View, StyleSheet } from "react-native";

export function AnimatedBackground() {
  return (
    <View style={styles.container}>
      {/* Base dark background */}
      <View style={styles.base} />

      {/* Emerald glow bottom left */}
      <View style={[styles.glow, styles.emeraldGlow, styles.bottomLeft]} />

      {/* Aqua glow top right */}
      <View style={[styles.glow, styles.aquaGlow, styles.topRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0C0F14",
    overflow: "hidden",
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0C0F14",
  },
  glow: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  emeraldGlow: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    shadowColor: "#10B981",
    shadowOpacity: 0.4,
    shadowRadius: 120,
    shadowOffset: { width: 0, height: 0 },
  },
  aquaGlow: {
    backgroundColor: "rgba(6, 182, 212, 0.08)",
    shadowColor: "#06B6D4",
    shadowOpacity: 0.4,
    shadowRadius: 120,
    shadowOffset: { width: 0, height: 0 },
  },
  bottomLeft: {
    bottom: -150,
    left: -150,
  },
  topRight: {
    top: -150,
    right: -150,
  },
});
