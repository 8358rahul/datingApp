import { Image, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TextInput, Pressable, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { Ionicons, Entypo, Feather, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router'
import constants from '../../constants';
import { io } from "socket.io-client";
import axios from 'axios';

const chatroom = () => {
    const params = useLocalSearchParams()
    const navigation = useNavigation()
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [checkMark, setCheckMark] = useState(false)
    const [selectedMessages, setSelectedMessages] = useState([]) 
    const [isLoading, setIsLoading] = useState(false)
    // socket io connection
    const socket = io(constants.SOCKET_URL, { transports: ['websocket'] });
    // const socket = io("http://192.168.1.32:9091", { transports: ['websocket'] });
    // socket.on('connect', () => console.log('connected to server'))
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: { color: 'black' },
            headerStyle: { backgroundColor: 'white' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" onPress={()=>{
                        socket.disconnect()
                        navigation.goBack()  
                    }}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={{ uri: constants.IMAGE_URL + params?.image }} style={{ width: 30, height: 30, borderRadius: 15, resizeMode: 'cover' }} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{params?.name}</Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="call-outline" size={24} color="black" />
                    <Ionicons name="videocam-outline" size={24} color="black" />
                </View>
            )

        })
    }, [navigation]) 
    socket.on('receive-message', (message) => {
        console.log("newMessage", message)
        // update the state to include new message
        setMessages([...messages, message])
    })
    const sendMessage = async (senderId, receiverId) => {
        socket.emit('send-message', { senderId, receiverId, message })
        setMessage("")
        // call the fetchMessages function here
        setTimeout(() => {
            fetchMessages()
        }, 200);

    }
    const fetchMessages = async () => {
        setIsLoading(true)
        try {
            const senderId = params?.senderId;
            const receiverId = params?.receiverId;
            const url = constants.API_URL + 'messages'
            const response = await axios.get(url, { params: { senderId, receiverId } })
            setMessages(response?.data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log('catch error: ', error)
        }
    }

    useEffect(() => {
        // fetch messages from the database
        fetchMessages()
    }, [])

    const formatTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedTime = hours + ':' + minutes + ' ' + ampm;
        return formattedTime;
    }

    const handleDelete = async () => {
        setIsLoading(true)
        try { 
            const url = constants.API_URL + 'delete'
            const response = await axios.delete(url, { data: { messageIds: selectedMessages } })
            console.log('response',  JSON.stringify(response))
            if(response?.data?.deletedCount>0){ 
                fetchMessages()
                setSelectedMessages([])
                setCheckMark(false)
                setIsLoading(false)
                Alert.alert(`You have Deleted ${response?.data?.deletedCount} messages successfully`)
            }
            
        } catch (error) {
            setIsLoading(false)
            console.log('catch error: ', error)
        }
    }

    const setData = (item) => {
        if (selectedMessages.includes(item?._id)) {
            setSelectedMessages(selectedMessages.filter((msgId) => msgId !== item?._id))
        } else {
            setSelectedMessages([...selectedMessages, item?._id])
        }
    }

  if(isLoading)return <ActivityIndicator size="large" color="#0000ff" style={{flex:1,justifyContent:'center',alignItems:'center'}}/>
    return (
        <KeyboardAvoidingView style={{
            flex: 1,
            backgroundColor: 'white',

        }}>
            {/* messages to be shown here */}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <>
                            {checkMark ?<AntDesign name={checkMark && selectedMessages.includes(item?._id) ? "checkcircle" : "checkcircleo"} size={24} color="black" onPress={() => setData(item)} style={{
                                position: 'absolute',
                                top: 15,
                                left: 10,
                                zIndex: 1

                            }}/>:null}
                            <Pressable
                                onLongPress={() => {setCheckMark(!checkMark)}}
                                key={index}
                                style={[item?.senderId?._id == params?.senderId ? styles.firstContainer : styles.secondContainer
                                ]}>
                                <Text style={styles.msgText}>{item?.message}</Text>
                                <Text style={styles.subText}>{formatTime(item?.date)}</Text>
                            </Pressable>
                        </>
                    )
                }}
            />

            <View style={styles.inputContainer}>
      
            {selectedMessages.length>0?  <AntDesign name="delete" size={24} color="black" onPress={handleDelete}/> : <Entypo name="emoji-happy" size={24} color="black" style={{ marginRight: 7 }} />}
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    placeholder="Type a message..."
                    style={styles.inputStyle} />
                <View style={styles.iconContainer}>
                    <Feather name="camera" size={24} color="black" />
                    <Feather name="mic" size={24} color="black" />

                </View>
                <Pressable
                    onPress={() => sendMessage(params?.senderId, params?.receiverId)}
                    style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 15 }}>
                    <Ionicons name="send" size={24} color="white" style={{ textAlign: 'center' }} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}

export default chatroom

const styles = StyleSheet.create({
    firstContainer: {
        alignSelf: 'flex-end',
        backgroundColor: "#F08080",
        padding: 8,
        maxWidth: '60%',
        borderRadius: 7,
        margin: 10,
    },
    secondContainer: {
        alignSelf: "flex-start",
        backgroundColor: "#D87093",
        padding: 8,
        margin: 10,
        borderRadius: 7,
        maxWidth: '60%',
    },
    msgText: {
        fontSize: 18,
        textAlign: 'left',
        color: 'white',
        fontWeight: '500'
    },
    subText: {
        fontSize: 10,
        textAlign: 'right',
        color: 'white',
        fontWeight: '200'

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
        marginBottom: 1,

    },
    inputStyle: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 25,
        paddingHorizontal: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
    },
})