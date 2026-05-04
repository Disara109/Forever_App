import { Stack } from "expo-router";
import '@/global.css';
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@/cache'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <GestureHandlerRootView style={{ flex: 1 }}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="shop" />
              <Stack.Screen name="checkout" />
            </Stack>
            <Toast />
          </WishlistProvider>
        </CartProvider>
    </GestureHandlerRootView>
    </ClerkProvider>
  )
}
