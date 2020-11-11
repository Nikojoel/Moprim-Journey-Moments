import React from "react"
import { FlatList, SafeAreaView, StatusBar } from "react-native"
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base"
import HomeFeedItem from "./HomeFeedItem"


const HomeFeed = ({data, extra}) => {
    if (!data) {
        return (
            <Text>Nada</Text>
        )
    }
    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={HomeFeedItem}
                keyExtractor={item => item.id}
                extraData={extra}
            />
        </SafeAreaView>
    )
}

export default HomeFeed
