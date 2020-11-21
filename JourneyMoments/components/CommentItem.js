import React, {useEffect, useState} from 'react'
import {Text, View, Image} from "react-native"
import {H2} from "native-base"
import Helper from "../helpers/Helper";

const CommentItem = ({data}) => {
    const [image, setImage] = useState(Helper.dummy)
    const user = Helper.parseJSON(data.user)

    useEffect(() => {
        if (user.photoURL !== "undefined") {
            setImage(user.photoURL)
        }
    }, [])
    return (
        <View>
            <View style={{flexDirection: 'row'}}>
            <Image source={{uri: image}} style={{width: 20, height: 20, borderRadius: 25, marginRight: 10}}/>
            <Text>{user.username}</Text>
            </View>
            <Text style={{marginLeft: 30}}>- {data.comment}</Text>
        </View>
    )
}

export default CommentItem