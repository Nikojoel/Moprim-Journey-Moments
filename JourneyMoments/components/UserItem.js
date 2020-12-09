import React from 'react'
import {Text, StyleSheet, Image} from 'react-native'
import {Content, Card, CardItem, Body, Icon} from 'native-base'
import Colors from "../values/Colors"
import Helper from "../helpers/Helper"

const UserItem = ({data}) => {
    const rating = Helper.ratingColor(data.rating)
    return (
        <Content style={styles.content}>
            <Card>
                <CardItem style={styles.card}>
                    <Image source={{uri: data.photoURL}} style={{
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        borderWidth: 2,
                        borderColor: rating
                    }}/>
                    <Body>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'ios-person'} color={'#000000'} size={30}/>
                            <Text style={styles.text}>{data.username}</Text>
                        </CardItem>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'star'} color={'#000000'} size={30}/>
                            <Text style={styles.text}>{data.rating} annotations</Text>
                        </CardItem>
                    </Body>
                </CardItem>
            </Card>
        </Content>
    )
}
const styles = StyleSheet.create({
    content: {
        margin: 5,
        marginLeft: 15,
        marginRight: 15,
        display: "flex",
    },
    text: {
        fontSize: 16,
    },
    card: {
        backgroundColor: Colors.commonBackground
    }
})
export default UserItem
