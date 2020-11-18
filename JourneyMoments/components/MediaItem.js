import React, {useEffect, useState} from 'react'
import {Text, View, Image} from "react-native"
import Helper from "../helpers/Helper";

const MediaItem = ({data}) => {
    const user = Helper.parseJSON(data.user)

    return (
        <View>
            <Image source={{uri: data.url}} style={{width: 150, height: 150}}/>
            <Image source={{uri: user.photoURL}} style={{width: 50, height: 50}}/>
            <Text>By user: {user.username}</Text>
            <Text>User rating {user.rating}</Text>
        </View>
    )
}

export default MediaItem