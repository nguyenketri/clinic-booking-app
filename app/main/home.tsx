import {View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput} from "react-native"
import { router} from "expo-router"
import { useState } from "react"


type te = {
    id: string,
    name: string
}
export default function Home(){
    const [test, setTest] = useState([
        {id:"1",name:"A"},
        {id:"2",name:"B"},
        {id:"3",name:"C"},
        {id:"4",name:"D"},
        {id:"5",name:"E"},
    ])  
    const [search, setSearch] = useState('')
    const handleSearch = (text: string) => {
        setSearch(text);
        if(text){
            const newT = test.filter((item) => {
                const itemN = item.name ? item.name.toUpperCase() : ''.toUpperCase(); 
                // 
                const sText = text.toUpperCase();
                return itemN.includes(sText)
            })
            setTest(newT)       
        }else{
            setTest([
                {id:"1",name:"A"},
                {id:"2",name:"B"},
                {id:"3",name:"C"},
                {id:"4",name:"D"},
                {id:"5",name:"E"},
            ]) 
        }
    }
    const [check, setCheck] = useState(true)
       const renderItem = ({item}: {item: te}) => {
        return(
          <View>
            <Text>{item.name}</Text>
        </View>  
        )
        
       }
    return(
       <View style = {styles.container}>
        <Text style= {styles.title}>🏥 Clinic Booking</Text>
        <Text style = {styles.subtitle}> Welcome back!</Text>

        <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/main/booking")}
      >
        <Text style={styles.cardTitle}>📅 Book Appointment</Text>
        <Text style={styles.cardDesc}>
          Schedule a new appointment
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/main/my-bookings")}
      >
        <Text style={styles.cardTitle}>📖 My Appointments</Text>
        <Text style={styles.cardDesc}>
          View your booked appointments
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
      style= {styles.logoutBtn}
      >
       <Text style ={styles.logoutText}> LOgout</Text>
     
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => setCheck(!check)}
      > 
      {
        check ? (<Text>Hidden</Text>)  : (<Text>Show </Text>) 
      }
        
      </TouchableOpacity>
      {
        check && (
           <FlatList
      data={test}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}

      /> 

        )
      }
       <TextInput
       style={styles.search}
       placeholder="Search"
       value={search}
       onChangeText={(text)=>handleSearch(text)}>
       
       </TextInput>

     
       </View>
    )
}

// styles
const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 24,
        backgroundColor: "#f5f7fa",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 16
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    cardDesc: {
        color: "#666",
        marginTop:4
    },
    logoutBtn: {
        alignItems:"center"
    },
    logoutText: {
        color: "red",
        fontWeight: "600",
        fontSize: 16,
       
    },
    search: {
        borderRadius:5,
        borderStyle:"solid",
        borderColor:'black',
        borderWidth:1
    }
})