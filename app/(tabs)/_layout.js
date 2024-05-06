import { Tabs } from "expo-router";
import { FontAwesome6, AntDesign, Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profiles",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="eye" size={24} color="black" />
              ) : (
                <AntDesign name="eye" size={24} color="gray" />
              ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="chatbubble-ellipses" size={24} color="black" />
              ) : (
                <Ionicons name="chatbubble-ellipses" size={24} color="gray" />
              ),
          }}
        />
        <Tabs.Screen
          name="bio"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome6 name="mask-face" size={24} color="black" />
              ) : (
                <FontAwesome6 name="mask-face" size={24} color="gray" />
              ),
          }}
        />
      </Tabs>
    </>
  );
}
