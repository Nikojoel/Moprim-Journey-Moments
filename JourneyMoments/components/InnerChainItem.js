import React from 'react'
import {View, TouchableOpacity, StyleSheet} from "react-native"
import {H2, Body, Card, CardItem, Content} from "native-base"
import {Icon} from "native-base"
import * as Colors from "../values/Colors";

const InnerChainItem = ({data, navigation}) => {
    const date = data.key.split("_")
    const ids = data.moprim

    return (
        <Content>
            <Body style={styles.container}>
                <Card style={styles.container2}>
                    <TouchableOpacity onPress={() => navigation.navigate("ChainList", {ids})}>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'calendar'} color={'#000000'} size={30}/>
                            <H2 style={styles.textCenter}>{`${date[2]}.${date[1]}.${date[3]}`}</H2>
                        </CardItem>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'location'} color={'#000000'} size={30}/>
                            <H2 style={styles.textCenter}>Total
                                distance: {(data.totalDistance / 1000).toFixed(1) + "km"}</H2>
                        </CardItem>
                        <CardItem style={styles.card}>
                            <Icon family={'FontAwesome'} name={'cloud'} color={'#000000'} size={30}/>
                            <H2 style={styles.textCenter}>{Math.round(data.totalCo2) + " grams of CO2"}</H2>
                        </CardItem>
                    </TouchableOpacity>
                </Card>
            </Body>
        </Content>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        height: '100%',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,

    },
    container2: {
        width: '95%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.commonBackground
    },
    textCenter: {
        textAlign: 'center',
        fontSize: 18
    },
    card: {
        backgroundColor: Colors.commonBackground
    }
})

export default InnerChainItem
