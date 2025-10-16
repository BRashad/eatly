import React from "react";
import { StyleSheet, View, Text } from "react-native";

export function HistoryScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Placeholder</Text>
      <Text>Recent scans will appear here once implemented.</Text>
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
