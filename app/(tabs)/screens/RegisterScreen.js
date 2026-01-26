import { View, Text, Button } from "react-native";
import { router } from "expo-router";
const RegisterScreen = () => {
    return(
        <View>
            <Text>Register Screen</Text>
            <Button title="Back to Login"
            onPress={() => router.back()} />
        </View>
    )
}
export default RegisterScreen;