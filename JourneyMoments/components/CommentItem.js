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
            <Image source={{uri: image}} style={{width: 50, height: 50}}/>
            <Text>User: {user.username}</Text>
            <Text>Comment: {data.comment}</Text>
            <Text>User rating {user.rating}</Text>
        </View>
    )
}

export default CommentItem