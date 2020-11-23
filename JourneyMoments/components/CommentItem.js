import React, {useEffect, useState} from 'react'
import {Text, View, Image} from "react-native"
import Helper from "../helpers/Helper"

const CommentItem = ({data}) => {
    const [image, setImage] = useState(Helper.dummy)
    const user = Helper.parseJSON(data.user)
    const rating = Helper.ratingColor(user.rating)

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
                <View style={{borderColor: rating, borderWidth: 2, borderRadius: 10 }}>
                    <Text style={{ textAlign: 'center', margin: 2 }}>{user.rating}</Text>
                </View>
            </View>
            <Text style={{marginLeft: 30}}>- {data.comment}</Text>
        </View>
    )
}

export default CommentItem