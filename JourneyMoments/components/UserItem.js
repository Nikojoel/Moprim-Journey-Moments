import React from 'react'
import {Text, StyleSheet, Image} from 'react-native'
import {Content, Card, CardItem, Body} from 'native-base'

const UserItem = ({data}) => {
    return (
        <Content style={styles.content}>
            <Card style={styles.card}>
                <CardItem>
                    <Image source={{uri: data.photoURL}} style={styles.image}/>
                    <Body style={{margin: 20}}>
                        <Text style={styles.text}>{data.username}</Text>
                        <Text style={styles.text}>{data.email}</Text>
                        <Text style={styles.text}>{data.rating} annotations</Text>
                    </Body>
                </CardItem>
            </Card>
        </Content>
    )
}
const styles = StyleSheet.create({
    content: {
        margin: 10,
        display: "flex"
    },
    image: {
        width: 100,
        height: 100
    },
    text: {
        fontSize: 16,
    }
})
export default UserItem
