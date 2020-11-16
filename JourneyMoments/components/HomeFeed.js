import React from "react"
import { FlatList, SafeAreaView, StatusBar, TouchableOpacity } from "react-native"
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base"
import HomeFeedItem from "./HomeFeedItem"
import Home from "../screens/Home";


const HomeFeed = ({data, extra, navigation}) => {
    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={({item}) =>
                    <HomeFeedItem item={item} navigation={navigation}/>
                }
                keyExtractor={item => item.id}
                extraData={extra}
                numColumns={2}
            />
        </SafeAreaView>
    )
}

export default HomeFeed
