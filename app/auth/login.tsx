import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Login(){
   const [ email, setEmail] = useState("");
   const [ password, setPassword] = useState("");

   const handleLogin = () => {
 router.replace("/main/home");
    if( !email || !password){
      alert("Email or Password empty")
      return;
    }
    
    // Call API here

    


   }

   return(
    <View style= {styles.container}>
      <Text style = {styles.title}> Login</Text>

      <TextInput
      style= {styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
      keyboardType="email-address"
      />


      <TextInput
      style= {styles.input}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <View style= {styles.spacing} />

      <Button title="Register" onPress={() => router.push("/auth/register")}></Button>

    </View>
   )

}

const styles = StyleSheet.create(
  {
    container: {
      flex:1,
      padding: 24,
      justifyContent:"center"
    },
    title:{
      fontSize:24,
      fontWeight: "600",
      marginBottom:24,
      textAlign:"center"
    },
    input:{
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 6,
      padding: 12,
      marginBottom: 16,
    },
    spacing: {
      height: 12,
    }
  }
)