import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@constants/colors";

export function PreferencesScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <Text style={styles.placeholder}>User preferences settings coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    marginTop: 12,
    color: COLORS.TEXT_SECONDARY,
  },
});
