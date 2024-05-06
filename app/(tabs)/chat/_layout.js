import { Stack } from "expo-router"; 


export default function ChatLayout() {
  return ( 
      <Stack >
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="select" options={{headerShown:false}}/>
        <Stack.Screen name="chatroom" />
      </Stack> 
  );
}
