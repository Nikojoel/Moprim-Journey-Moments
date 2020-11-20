import React, {useState} from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import Helper from "../helpers/Helper";
import {H2} from 'native-base'

const UserItem = ({data}) => {
    return (
        <View style={styles.text}>
            <Text>username: {data.username}</Text>
            {data.photoURL !== "undefined" && <>
                <Image source={{uri: data.photoURL}} style={{width: 250, height: 250}}/>
            </>}
            <Text>email: {data.email}</Text>
            <Text>rating: {data.rating}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    text: {
        marginBottom: 20,
        marginTop: 20
    },
})
export default UserItem
