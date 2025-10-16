import React from "react";
import { StyleSheet, View, Text } from "react-native";

import type { Product } from "@app-types/product-types";

interface ProductSummaryProps {
  product: Product;
}

export function ProductSummary({
  product,
}: ProductSummaryProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text>{`Barcode: ${product.barcode}`}</Text>
      {product.healthScore !== undefined && (
        <Text>{`Health Score: ${product.healthScore}`}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});
