import React from "react";
import { router } from "expo-router";
import { View, Text, Button, StyleSheet} from "react-native"
const LoginScreen = () => {
     return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Button
        title="Go to Register"
        onPress={() => router.push("/register")}
      />

      <Button
        title="Login"
        onPress={() => router.replace("/home")}
      />
    </View>
  );
}
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    title:{
        fontSize:24,
        marginBottom:20
    }
})