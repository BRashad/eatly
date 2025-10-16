import { create } from "zustand";

interface ScanState {
  currentBarcode: string | null;
  manualEntry: string;
  setBarcode: (barcode: string | null) => void;
  setManualEntry: (value: string) => void;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  currentBarcode: null,
  manualEntry: "",
  setBarcode: (barcode): void => set({ currentBarcode: barcode }),
  setManualEntry: (value): void => set({ manualEntry: value }),
  reset: (): void => set({ currentBarcode: null, manualEntry: "" }),
}));
