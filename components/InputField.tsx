import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

type Props = {}

const inputField = (props: React.ComponentProps<typeof TextInput>) => {
  return (
    <TextInput style={styles.inputField}
    {...props}/>
  )
}

export default inputField

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: Colors.white,
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignSelf: 'stretch',
        borderRadius: 5,
        fontSize: 16,
        color: "#333",
        marginBottom: 20
      }
})