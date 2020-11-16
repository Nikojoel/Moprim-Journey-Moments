import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Container, View, ListItem, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import Helper from "../helpers/Helper";
import Colors from "../values/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeFeedItem = ({ item, navigation }) => {
    //const {icon, color} = Helper.transportIcon(item.activity)
    const time = Helper.unixToTime(parseInt(item.timestampStart))

    return (
        <View noBorder onPress={() => navigation.navigate("Single", { item })}>
            {/* style={container(color) */}
            <TouchableOpacity  onPress={() => navigation.navigate("Single", { item })}>
            <View style={{flexDirection: 'row'}}>
                {/*<Icon name={icon} style={styles.mainIcon} />*/}
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
        paddingHorizontal: 10
    },
    ratingIcon: {
        fontSize: 24,
        textAlign: 'center',
        flex: 1
    },
    ratingText: {
        flex: 1,
        textAlign: 'left'
    }

});


export default HomeFeedItem
