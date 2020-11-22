import React, {useEffect, useState} from 'react'
import {Text, View, Image} from "react-native"
import Helper from "../helpers/Helper";

const MediaItem = ({data}) => {
    const user = Helper.parseJSON(data.user)

    return (
        <View>
            <Image source={{uri: data.url}} style={{width: '100%', height: 200, resizeMode: 'cover'}}/>
        </View>
    )
}

export default MediaItem