import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    > 
      {/* Default*/}
      
      {/* AUTH */}
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="auth/register"
        options={{ title: "Register" }}
      />

      {/* MAIN */}
      <Stack.Screen
        name="main/home"
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="main/booking"
        options={{ title: "Booking" }}
      />
      <Stack.Screen
        name="main/my-bookings"
        options={{ title: "My Bookings" }}
      />
    </Stack>
  );
}
