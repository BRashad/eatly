import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ScanScreen } from "@screens/scan-screen";
import { ProductDetailScreen } from "@screens/product-detail-screen";
import { PreferencesScreen } from "@screens/preferences-screen";
import { HistoryScreen } from "@screens/history-screen";

export type RootStackParamList = {
  Scan: undefined;
  ProductDetail: { productId: string };
  Preferences: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Scan">
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{ title: "Scan Product" }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Product Detail" }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ title: "Preferences" }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Scan History" }}
      />
    </Stack.Navigator>
  );
}
