import React, {useEffect, useState} from 'react'
import {Text, View, Image, StyleSheet} from "react-native"
import Helper from "../helpers/Helper"
import {Card, CardItem} from "native-base";

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
            <Card style={{flexDirection: 'row'}}>
                <Image source={{uri: image}} style={{
                    width: 45,
                    height: 45,
                    borderRadius: 25,
                    margin: 10,
                    borderColor: rating,
                    borderWidth: 2,
                }}/>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                    <CardItem>
                        <Text style={styles.user}>{user.username} </Text>
                    </CardItem>
                    <Text style={styles.comment}>{data.comment}</Text>
                </View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    user: {
        fontSize: 20,
        marginTop: -15,
        marginLeft: -20,
        fontWeight: 'bold',
    },
    comment: {
        fontSize: 15,
        marginTop: -10
    },
})

export default CommentItem