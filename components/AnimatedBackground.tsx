import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface AnimatedParticle {
  id: string;
  animX: Animated.Value;
  animY: Animated.Value;
  animOpacity: Animated.Value;
  startX: number;
  startY: number;
  size: number;
}

interface AnimatedSpark {
  id: string;
  animX: Animated.Value;
  animY: Animated.Value;
  animOpacity: Animated.Value;
  startX: number;
  startY: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<AnimatedParticle[]>([]);
  const [sparks, setSparks] = useState<AnimatedSpark[]>([]);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sparkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create and animate particles
  useEffect(() => {
    const createParticle = () => {
      const id = Math.random().toString();
      const startX = Math.random() * SCREEN_WIDTH;
      const startY = SCREEN_HEIGHT + 20;
      const duration = 8000 + Math.random() * 4000;
      const size = Math.random() * 3 + 1;
      const offsetX = (Math.random() - 0.5) * 60;

      const animX = new Animated.Value(startX);
      const animY = new Animated.Value(startY);
      const animOpacity = new Animated.Value(0);

      const particle: AnimatedParticle = {
        id,
        animX,
        animY,
        animOpacity,
        startX,
        startY,
        size,
      };

      setParticles((prev) => [...prev, particle]);

      // Animate upward and fade out
      Animated.sequence([
        Animated.timing(animOpacity, {
          toValue: Math.random() * 0.3 + 0.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(animY, {
            toValue: startY - SCREEN_HEIGHT * 0.6,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: startX + offsetX,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(animOpacity, {
            toValue: 0,
            duration: duration - 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      });
    };

    // Create particles periodically
    particleIntervalRef.current = setInterval(() => {
      createParticle();
    }, 300);

    return () => {
      if (particleIntervalRef.current) clearInterval(particleIntervalRef.current);
    };
  }, []);

  // Create and animate sparks
  useEffect(() => {
    const createSpark = () => {
      const id = Math.random().toString();
      const startX = Math.random() * SCREEN_WIDTH;
      const startY = Math.random() * SCREEN_HEIGHT * 0.7;
      const duration = 1500 + Math.random() * 1500;
      const offsetX = (Math.random() - 0.5) * 150;
      const offsetY = -Math.random() * 200;
      const delay = Math.random() * 2000;

      const animX = new Animated.Value(startX);
      const animY = new Animated.Value(startY);
      const animOpacity = new Animated.Value(0);

      const spark: AnimatedSpark = {
        id,
        animX,
        animY,
        animOpacity,
        startX,
        startY,
      };

      setSparks((prev) => [...prev, spark]);

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(animOpacity, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(animX, {
              toValue: startX + offsetX,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(animY, {
              toValue: startY + offsetY,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(animOpacity, {
              toValue: 0,
              duration: duration - 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setSparks((prev) => prev.filter((s) => s.id !== id));
        });
      }, delay);
    };

    // Create sparks periodically
    sparkIntervalRef.current = setInterval(() => {
      createSpark();
    }, 1500);

    return () => {
      if (sparkIntervalRef.current) clearInterval(sparkIntervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Base dark background */}
      <View style={styles.base} />

      {/* Emerald glow bottom left */}
      <View style={[styles.glow, styles.emeraldGlow, styles.bottomLeft]} />

      {/* Aqua glow top right */}
      <View style={[styles.glow, styles.aquaGlow, styles.topRight]} />

      {/* Floating particles */}
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.animX },
                { translateY: particle.animY },
              ],
              opacity: particle.animOpacity,
              width: particle.size,
              height: particle.size,
            },
          ]}
        />
      ))}

      {/* Spark streaks */}
      {sparks.map((spark) => (
        <Animated.View
          key={spark.id}
          style={[
            styles.spark,
            {
              transform: [
                { translateX: spark.animX },
                { translateY: spark.animY },
              ],
              opacity: spark.animOpacity,
            },
          ]}
        />
      ))}
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
  particle: {
    borderRadius: 50,
    backgroundColor: "rgba(34, 197, 94, 0.5)",
    position: "absolute",
  },
  spark: {
    width: 2,
    height: 6,
    backgroundColor: "rgba(6, 182, 212, 0.8)",
    position: "absolute",
    borderRadius: 1,
  },
});
