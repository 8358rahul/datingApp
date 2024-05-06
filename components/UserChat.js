import { StyleSheet, Text, View ,Pressable, Image} from 'react-native'
import React,{useEffect,useState} from 'react'
import constants from '../app/constants'
import { useRouter } from 'expo-router'
import axios from 'axios'

const UserChat = ({item,userId,}) => {
    const router = useRouter()
    const [messages, setMessages] = useState([])
    const getLastMessage = () => {
        const n = messages.length
        return messages[n - 1]
    }
    const lastMessage = getLastMessage()

    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = item?._id;
            const url = constants.API_URL + 'messages'
            const response = await axios.get(url, { params: { senderId, receiverId } })

            setMessages(response?.data)
        } catch (error) {
            console.log('catch error: ', error)
        }
    }

    useEffect(() => {
        // fetch messages from the database
        fetchMessages()
    }, [])


  return (
    <Pressable 
    onPress={()=>router.push({
        pathname:'/chat/chatroom',
        params:{
            image:item?.profileImages[0],
            name:item?.name,
            receiverId:item?._id,
            senderId:userId

        }
    })}
    style={{
        flexDirection:'row',
        alignItems:'center', 
        gap:10,
        marginVertical:12
    
    }}
    > 
        <View>  
            <Image source={{uri:constants.IMAGE_URL+ item?.profileImages[0]}} style={{width:60,height:60,borderRadius:35}}/>
        </View>
        <View>
            <Text style={{fontSize:17,fontWeight:'500',color:"#DE3163"}}>{lastMessage?lastMessage?.message :`Start Chat with ${item?.name}`}</Text>
            <Text style={{fontSize:15,color:'gray',fontWeight:"500",marginTop:2}}>{item?.desc}</Text>
        </View>
    </Pressable>
  )
}

export default UserChat

const styles = StyleSheet.create({})