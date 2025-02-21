import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";

export const isNative = () => Capacitor.isNativePlatform();
export const isAndroid = () => Capacitor.getPlatform() === "android";
export const isIOS = () => Capacitor.getPlatform() === "ios";
export const isWeb = () => Capacitor.getPlatform() === "web";

export const setupNativePlatform = async () => {
  if (isNative()) {
    // Set status bar color
    await StatusBar.setStyle({ style: Style.Dark });
    if (isAndroid()) {
      await StatusBar.setBackgroundColor({ color: "#377CC8" });
    }

    // Handle back button
    App.addListener("backButton", ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
  }
};

export const vibrate = async () => {
  if (isNative()) {
    await Haptics.impact({ style: ImpactStyle.Light });
  }
};
