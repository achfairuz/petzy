import React, {useCallback} from "react";
import {View} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import RootNavigator from "./src/presentation/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync();

const App = (): React.JSX.Element | null => {
  const [fontsLoaded] = useFonts({
    "Outfit-Light": require("./assets/fonts/Outfit-Light.ttf"),
    "Outfit-Regular": require("./assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("./assets/fonts/Outfit-Medium.ttf"),
    "Outfit-SemiBold": require("./assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("./assets/fonts/Outfit-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{flex: 1}} onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        <RootNavigator />
        <Toast />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
