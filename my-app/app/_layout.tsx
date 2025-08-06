import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAutoLogin } from "@/hooks/useAutoLogin";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { RegisterAvatar } from "@/components/RegisterAvatar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "@/store/authCtx";

function AppContent() {
  const { data, error, isLoading } = useAutoLogin();
  const userId = useAuthStore((state) => state.userId);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || isLoading) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <Center style={{ flex: 1 }}>
          <RegisterAvatar />
          <HStack space="lg" style={{ marginTop: 20 }}>
            <Spinner color={colors.amber[600]} size="large" />
            <ThemedText type="default">Please wait...</ThemedText>
          </HStack>
        </Center>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <Center style={{ flex: 1 }}>
          <ThemedText type="default">Error logging in</ThemedText>
        </Center>
      </ThemedView>
    );
  }

  return (
    <>
      
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          
          <Stack.Screen name="+not-found" />
        </Stack>
    
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GluestackUIProvider mode="system">
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
