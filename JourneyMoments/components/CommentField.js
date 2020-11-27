import React, {useState, useEffect} from 'react'
import {Container, Icon, View, Input, Text, H2, Button, Body} from 'native-base'
import {TextInput, StyleSheet, TouchableOpacity} from "react-native";
import Notification from "./Notification";

const CommentField = ({handleSend, error, className}) => {
    const [text, setText] = useState('')

    return (
        <View style={styles.container}>
            <TextInput
                style={className}
                placeholder={error}
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
        position: "absolute",
        padding: 10,
        elevation: 10,
        bottom: 0
    },
    input: {
        height: 30,
        flex: 1,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 10
    }
})

export default CommentField