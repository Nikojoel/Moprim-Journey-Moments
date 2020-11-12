import React, {useState, useEffect} from 'react'
import {Container, Input, Text, H2, Button, Body} from 'native-base'
import {TextInput, StyleSheet, TouchableOpacity} from "react-native";

const CommentField = ({handleSend}) => {
    const [text, setText] = useState('')

    return (
        <Container style={styles.container}>
            <H2>Comment this trip</H2>
            <TextInput
                style={styles.input}
                placeholder="Type here"
                onChangeText={(text) => {
                    setText(text)
                }}
            />
            <TouchableOpacity style={styles.btn}
                onPress={() => {
                    handleSend(text)
                }}>
            <Text>Send</Text>
            </TouchableOpacity>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "gray",
        width: "100%"
    },
    input: {
        width: '100%',
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 10,
    },
    btn: {
        width: '80%',
        backgroundColor: "red",
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    }

})

export default CommentField