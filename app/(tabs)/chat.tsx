import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

type Props = {}

const ChatScreen = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>History Screen</Text>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})