import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  placeholder: {
    marginTop: 12,
    color: "#6B7280",
  },
});
