import { StyleSheet, Text, View,Pressable } from 'react-native'
import React,{useEffect,useId,useState,useCallback} from 'react'
import { Ionicons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import constants from '../../constants';
import { useRouter,useFocusEffect } from 'expo-router'; 
import UserChat from '../../../components/UserChat';

const index = () => {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [profiles, setProfiles] = useState([])
  const [matches, setMatches] = useState([]) 

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    };
    fetchUser();
  }, []);


useEffect(() => {
  if(userId){
    fetchReceivedLikedDetails()
    fetchMatches()

  }
},[userId])
const fetchReceivedLikedDetails = async () => {
  try { 
    const url = `${constants.API_URL}received-likes/${userId}/details`;
    const response = await axios.get(url);   
    setProfiles(response.data); 
  } catch (error) {
    console.log("inside catch",error)
  }
}

const fetchMatches = async () => {
  try {
    const url = `${constants.API_URL}users/${userId}/matches`;
    const response = await axios.get(url); 
    setMatches(response.data)
  } catch (error) {
    console.log("inside catch",error)
  }
} 
 
useFocusEffect(
  useCallback(() => { 
    if(userId){ 
      fetchMatches()
    }
  }, [])
)
 
  return (
    <View style={styles.container}> 
    <View style={{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
    }}>
    <Text style={{fontSize:20,fontWeight:"500"}}>Chat</Text>
    <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
    </View>
    <Pressable
    onPress={()=>{
      router.push({
        pathname:"/chat/select",
        params:{
          profiles:JSON.stringify(profiles),
          userId:userId
        }
      })
    }}
    style={{marginVertical:12,flexDirection:'row',alignItems:'center'}}>
      <View style={{width:50,height:50,borderRadius:25,backgroundColor:'#E0E0E0',justifyContent:'center',alignItems:'center'}}> 
      <Feather name="heart" size={24} color="black" />
      </View>

    <Text style={{fontSize:17,marginLeft:10,flex:1}}>You have got {profiles.length} likes</Text>
    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
    </Pressable>
    <View>
      {matches.map((match,index)=>{
        return <UserChat key={index} userId={userId} item={match}/>
      })}
    </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding:10,
    backgroundColor: '#fff',
  }
})