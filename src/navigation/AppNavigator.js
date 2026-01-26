import React from "react";
import { createNativeStackNavigator} from "@react-navigation/native-stack"

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import BookingScreen from "../screens/BookingScreen";
import MyBookingScreen from "../screens/MyBookingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="MyBookings" component={MyBookingScreen}/>
        </Stack.Navigator>
    )
}