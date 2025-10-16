import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "@navigation/root-navigator";
import { useScanProduct } from "@hooks/use-scan-product";
import { useScanStore } from "@store/scan-store";
import { ProductSummary } from "@components/product-summary";
import {
  requestCameraPermission,
  simulateScan,
} from "@services/camera-service";
import { AppError } from "@utils/app-error";

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, "Scan">;

export function ScanScreen({ navigation }: ScanScreenProps): React.JSX.Element {
  const [input, setInput] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { scanProduct, data, loading, error } = useScanProduct();
  const setBarcode = useScanStore((state) => state.setBarcode);
  const reset = useScanStore((state) => state.reset);

  const handleLookup = async (): Promise<void> => {
    if (!input.trim()) {
      return;
    }
    setCameraError(null);
    await scanProduct(input.trim());
    setBarcode(input.trim());
  };

  const handleClear = (): void => {
    setInput("");
    reset();
    setCameraError(null);
  };

  const handleMockScan = async (): Promise<void> => {
    try {
      await requestCameraPermission();
      const scannedBarcode = await simulateScan("012345678901");
      setInput(scannedBarcode);
      await scanProduct(scannedBarcode);
      setBarcode(scannedBarcode);
      setCameraError(null);
    } catch (permissionError) {
      const message =
        permissionError instanceof AppError
          ? permissionError.message
          : "Unable to access camera. Please try again.";
      setCameraError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Lookup</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter barcode"
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.actions}>
        <Button title="Lookup" onPress={handleLookup} disabled={loading} />
        <Button title="Clear" onPress={handleClear} color="#6B7280" />
        <Button title="Mock Scan" onPress={handleMockScan} disabled={loading} />
      </View>

      {loading && <ActivityIndicator style={styles.indicator} />}

      {cameraError && <Text style={styles.error}>{cameraError}</Text>}
      {error && <Text style={styles.error}>{error.message}</Text>}

      {data && (
        <View style={styles.resultContainer}>
          <ProductSummary product={data} />
          <Button
            title="View Details"
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: data.id })
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  indicator: {
    marginVertical: 16,
  },
  error: {
    marginTop: 16,
    color: "#B91C1C",
  },
  resultContainer: {
    marginTop: 24,
    gap: 12,
  },
});
