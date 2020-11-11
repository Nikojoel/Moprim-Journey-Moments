import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Container, ListItem, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import Helper from "../helpers/Helper";

const HomeFeedItem = ({ item }) => {

    const { icon, color } = Helper.transportIcon(item.originalActivity)
    const time = Helper.unixToTime(parseInt(item.timestampStart))

    return (
        <ListItem noBorder>
            <Content >
                <Card>
                    <CardItem style={container(3,3,3,0,color)} >
                        <Left>
                            <Icon name={icon} style={styles.mainIcon} />
                            <Body>
                                <Text>{item.date}</Text>
                                <Text>{time}</Text>
                                <Text note>{item.distance}m</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem style={container(0,3,3,8,color)}>
                            <Icon name='speedometer' style={styles.ratingIcon}/>
                            <Text style={styles.ratingText}>{item.rating.speed}</Text>
                            <Icon name='brush' style={styles.ratingIcon}/>
                            <Text style={styles.ratingText}>{item.rating.cleanness}</Text>
                            <Icon name='cloud' style={styles.ratingIcon}/>
                            <Text style={styles.ratingText}>{item.rating.comfort}</Text>
                    </CardItem>
                </Card>
            </Content>
        </ListItem>
    )
}

const container = (t,s,e,b,color) => {
    return {
        borderTopWidth: t,
        borderStartWidth: s,
        borderEndWidth: e,
        borderBottomWidth: b,
        borderColor: color
    }
}

const styles = StyleSheet.create({
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
        flex:1,
        textAlign: 'left'
    }

  });


export default HomeFeedItem
