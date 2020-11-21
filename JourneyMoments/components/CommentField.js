import React, {useState, useEffect} from 'react'
import {Container,Icon, View, Input, Text, H2, Button, Body} from 'native-base'
import {TextInput, StyleSheet, TouchableOpacity} from "react-native";

const CommentField = ({handleSend}) => {
    const [text, setText] = useState('')

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Type here"
                onChangeText={(text) => {
                    setText(text)
                }}
            />
            <TouchableOpacity
                onPress={() => {
                    handleSend(text)
                }}>
            <Icon name='send'/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: 'row',
        margin: 10,
        flex: 1
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 20,
        padding: 0,
        marginRight: 10    
    },


})

export default CommentField