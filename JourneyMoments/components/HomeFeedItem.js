import React from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import { Container, View, ListItem, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import Helper from "../helpers/Helper";
import Colors from "../values/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeFeedItem = ({ item, navigation }) => {
    
    const { icon, color } = Helper.transportIcon(item.activity)
    const time = Helper.unixToTime(parseInt(item.timestampStart))

    return (
        <View noBorder style={container(color)}>
            <TouchableOpacity onPress={() => navigation.navigate("Single", { item })}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon name={icon} style={styles.mainIcon} />
                    <View style={{ flexDirection: 'column', marginRight: 10, justifyContent: 'center'}}>
                    {item.user.photoURL !== undefined ?
                        <Image source={{ uri: item.user.photoURL }} style={styles.profile} /> : <Icon name="person-outline" style={styles.profile} />}
                    <Text style={{fontSize: 12, alignSelf: 'center', marginTop: 5}}>{item.user.username}</Text>
                    </View>
                </View>
                <Text>{item.date}</Text>
                <Text>{time}</Text>
                <Text note>{item.distance}m</Text>
            </TouchableOpacity>
        </View>
    )
}

const container = (color) => {
    return {
        backgroundColor: color,
        flexDirection: 'column',
        padding: 10,
        flex: 1,
        margin: 2
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.plane,
        flexDirection: 'column',
        flex: 1,
        margin: 2
    },
    mainIcon: {
        fontSize: 50,
        paddingHorizontal: 10,
        flex: 1
    },
    ratingIcon: {
        fontSize: 24,
        textAlign: 'center',
        flex: 1
    },
    ratingText: {
        flex: 1,
        textAlign: 'left'
    },
    profile: {   
        width: 50,
        height: 50,
        alignSelf: 'flex-end',
        borderRadius: 25
        
    }

});


export default HomeFeedItem
