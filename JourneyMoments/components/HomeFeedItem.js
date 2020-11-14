import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Container, View, ListItem, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import Helper from "../helpers/Helper";
import Colors from "../values/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeFeedItem = ({ item, navigation }) => {

    const { icon, color } = Helper.transportIcon(item.originalActivity)
    const time = Helper.unixToTime(parseInt(item.timestampStart))

    return (
        <View noBorder style={styles.container} onPress={() => navigation.navigate("Single", { item })}>
            <TouchableOpacity  onPress={() => navigation.navigate("Single", { item })}>
            <View style={{flexDirection: 'row'}}>
                <Icon name={icon} style={styles.mainIcon} />
                <Text >{item.user.username}</Text>
            </View>
            
            <Text>{item.date}</Text>
            <Text>{time}</Text>
            <Text note>{item.distance}m</Text>
            <Icon name='speedometer' style={styles.ratingIcon} />
            <Text style={styles.ratingText}>{item.rating.speed}</Text>
            <Icon name='brush' style={styles.ratingIcon} />
            <Text style={styles.ratingText}>{item.rating.cleanness}</Text>
            <Icon name='cloud' style={styles.ratingIcon} />
            <Text style={styles.ratingText}>{item.rating.comfort}</Text>
            </TouchableOpacity>
        </View>
    )
}

const container = (t, s, e, b, color) => {
    return {
        borderTopWidth: t,
        borderStartWidth: s,
        borderEndWidth: e,
        borderBottomWidth: b,
        borderColor: color
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
