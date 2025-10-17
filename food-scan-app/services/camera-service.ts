import { AppError } from "@utils/app-error";

export async function requestCameraPermission(): Promise<void> {
  const granted = true;
  if (!granted) {
    throw new AppError("PERMISSION_DENIED", "Camera permission required");
  }
}

export async function simulateScan(barcode: string): Promise<string> {
  return barcode;
}
