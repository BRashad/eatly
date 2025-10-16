import React from "react";
import { StyleSheet, View, Text } from "react-native";

export function PreferencesScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences Placeholder</Text>
      <Text>Customize dietary preferences and alerts here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});
