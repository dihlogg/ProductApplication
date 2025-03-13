import { Ionicons } from "@expo/vector-icons"
import { StyleSheet } from "react-native"

export const icon = {
    index: ({ color }: {color: string}) => (
        <Ionicons name='home-outline' size={22} color={color} />
    ),
    explore: ({ color }: {color: string}) => (
        <Ionicons name='search-outline' size={22} color={color} />
    ),
    chat: ({ color }: {color: string}) => (
        <Ionicons name='chatbox' size={22} color={color} />
    ),
    cart: ({ color }: {color: string}) => (
        <Ionicons name='cart-outline' size={22} color={color} />
   ),
    history: ({ color }: {color: string}) => (
        <Ionicons name='timer-outline' size={22} color={color} />
    ),
    profile: ({ color }: {color: string}) => (
        <Ionicons name='person-outline' size={22} color={color} />
    ),
};

const styles = StyleSheet.create({

})