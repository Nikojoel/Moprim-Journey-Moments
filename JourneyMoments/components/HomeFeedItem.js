import React from "react";
import { FlatList } from "react-native";
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base"


const HomeFeedItem = ({item}) => {
    return (
        <ListItem>
            <Body>
                <Text>{item.id}</Text>
                <Text>{item.co2}</Text>
                <Text>{item.originalActivity}</Text>
            </Body>
        </ListItem>
    )
}

export default HomeFeedItem