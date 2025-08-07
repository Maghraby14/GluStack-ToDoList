import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
    
    
  return (

    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerShown:false,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Log in' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen
        name="list"
        options={{
         
          presentation: 'modal', 
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="reminder"
        options={{
         
           
          headerShown: true,
        }}
      />
      
    </Stack>
  );
}
