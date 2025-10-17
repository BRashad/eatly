import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "@navigation/root-navigator";
import { COLORS } from "@constants/colors";

type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductDetail"
>;

export function ProductDetailScreen(
  { route }: ProductDetailScreenProps,
): React.JSX.Element {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Detail</Text>
      <Text>{`Product ID: ${productId}`}</Text>
      <Text style={styles.placeholder}>Detailed product view coming soon.</Text>
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
