import React from 'react'
import {View, TouchableOpacity, StyleSheet} from "react-native"
import {H2, Body, Card, CardItem, Content} from "native-base"
import {Icon} from "native-base"
import * as Colors from "../values/Colors";

const InnerChainItem = ({data, navigation}) => {
    const date = data.key.split("_")
    const ids = data.moprim

    return (
        <View style={styles.kebab}>
            <Body style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.navigate("ChainList", {ids})}>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'calendar'} color={'#000000'} size={30}/>
                            <H2 style={styles.textCenter}>{`${date[2]}.${date[1]}.${date[3]}`}</H2>
                        </CardItem>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'location'} color={'#000000'} size={30}/>
                            <H2 style={styles.textCenter}>Distance: {(data.totalDistance / 1000).toFixed(1) + "km"}</H2>
                        </CardItem>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'cloud'} color={'#000000'} size={30}/>
                            <H2 style={styles.textCenter}>{Math.round(data.totalCo2) + "g of CO2"}</H2>
                        </CardItem>
                    </TouchableOpacity>
            </Body>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    textCenter: {
        textAlign: 'center',
        fontSize: 16
    },
    card: {
        backgroundColor: Colors.commonBackground,
        flex: 1,
    },
    kebab: {
        flexDirection: 'column',
        margin: 3,
        flex: 1,
        backgroundColor: Colors.commonBackground,
    }
})

export default InnerChainItem
