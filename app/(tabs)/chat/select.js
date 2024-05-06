import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import constants from '../../constants'
import { Entypo, FontAwesome, AntDesign } from "@expo/vector-icons";
import axios from 'axios';

const select = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const profiles = JSON.parse(params.profiles)
  const userId = params.userId

  const handleMatch = async (selectedId) => {
    try {
      const params = { currentID: userId, selectedId: selectedId}
      const url = `${constants.API_URL}create-match`;
      const response = await axios.post(url, params); 
      setTimeout(()=>{
        router.push('/chat')
      },500)
    } catch (error) {
      console.log("inside catch", error)
    }
  }
  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
      <View style={{
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',

      }}>
        <View style={{ backgroundColor: '#F0F0F0', padding: 10, borderRadius: 18 }}>
          <Text>Nearby🔥</Text>
        </View>
        <View style={{ backgroundColor: '#F0F0F0', padding: 10, borderRadius: 18 }}>
          <Text>Looking For 💓</Text>
        </View>
        <View style={{ backgroundColor: '#F0F0F0', padding: 10, borderRadius: 18 }}>
          <Text>Turn-Ons 💌</Text>
        </View>
      </View>
      {
        profiles.length > 0 ? <View style={{ marginTop: 20 }}>
          {
            profiles.map((profile, index) => {
              return (
                <View style={{ marginVertical: 15 }} key={index}>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
                      <View>
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>
                          {profile?.name}
                        </Text>
                        <Text
                          style={{
                            width: 200,
                            marginTop: 15,
                            fontSize: 16,
                            lineHeight: 25,
                            marginBottom: 8,
                          }}
                        >
                          {profile?.desc?.length > 160
                            ? profile?.desc
                            : profile.desc.substr(0, 160)}
                        </Text>
                      </View>
                      {profile?.profileImages.slice(0, 1).map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: constants.IMAGE_URL + image }}
                          style={{
                            width: 260,
                            height: 260,
                            borderRadius: 5,
                            resizeMode: "cover",
                          }}
                        />
                      ))}
                    </View>
                  </ScrollView>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 12,
                    }}
                  >
                    <Entypo name="dots-three-vertical" size={26} color="black" />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <Pressable
                        style={styles.like}
                      >
                        <FontAwesome name="diamond" size={27} color="#FF033E" />
                      </Pressable>
                      <Pressable
                        style={styles.like}
                        onPress={() => handleMatch(profile?._id)}
                      >
                        <AntDesign name="hearto" size={27} color="#FF033E" />
                      </Pressable>
                    </View>
                  </View>
                  <View>
                    <Text>Turn-Ons💌</Text>
                    <View style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: 10

                    }}>
                      {
                        profile?.turnOns?.map((turnOn, index) => {
                          return (
                            <View key={index} style={{ backgroundColor: '#DE3163', padding: 10, borderRadius: 18, marginVertical: 10 }}>
                              <Text style={{ color: 'white', textAlign: 'center', fontWeight: "500" }}>{turnOn}</Text>
                            </View>
                          )
                        })
                      }
                    </View>

                  </View>
                  <View style={{marginTop:12}}>
                    <Text>Looking For 👁️</Text>
                    <View style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: 10

                    }}>
                      {
                        profile?.lookingFor?.map((turnOn, index) => {
                          return (
                            <View key={index} style={{ backgroundColor: '#FBCEB1', padding: 10, borderRadius: 18, marginVertical: 10 }}>
                              <Text style={{ color: 'white', textAlign: 'center', fontWeight: "500" }}>{turnOn}</Text>
                            </View>
                          )
                        })
                      }
                    </View>

                  </View>
                </View>

              )
            })
          }
        </View> : <Text style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: '600',
          marginTop: 50
        }}>No profiles found</Text>
      }
    </ScrollView>
  )
}

export default select

const styles = StyleSheet.create({
  like: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
})