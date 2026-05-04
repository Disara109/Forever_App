import { Stack } from "expo-router";
import '@/global.css';
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import { ClerkProvider } from '@clerk/expo'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="shop" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="addresses/index" />
              <Stack.Screen name="admin/products" />
              <Stack.Screen name="admin/_layout.tsx" />
              <Stack.Screen name="admin/index.tsx" />
              <Stack.Screen name="admin/orders.tsx" />
              <Stack.Screen name="orders/[id]" />
              <Stack.Screen name="orders/index" />
            </Stack>
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  )
}
