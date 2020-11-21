import React from "react"
import { FlatList, SafeAreaView, StatusBar, TouchableOpacity, RefreshControl } from "react-native"
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base"
import HomeFeedItem from "./HomeFeedItem"
import Home from "../screens/Home";
import Helper from "../helpers/Helper";

const HomeFeed = ({data, extra, navigation, refresh, onRefresh}) => {
    console.log(data)
    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={({item}) =>
                    <HomeFeedItem item={item} navigation={navigation}/>
                }
                keyExtractor={item => Helper.generateUUID()}
                extraData={extra}
                numColumns={2}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                  }
            />
        </SafeAreaView>
    )
}

export default HomeFeed
