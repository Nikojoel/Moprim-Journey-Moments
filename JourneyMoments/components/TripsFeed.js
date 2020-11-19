import React from "react"
import { FlatList, SafeAreaView, StatusBar, TouchableOpacity, RefreshControl } from "react-native"
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base"
import InnerChainItem from "../components/InnerChainItem";

const TripsFeed = ({data, extra, navigation, refresh, onRefresh}) => {
    
    return (
        <FlatList
                data={data}
                renderItem={({item}) =>
                    <InnerChainItem data={item}  navigation={navigation}/>     
                }
                keyExtractor={data.key}
                extraData={extra}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                  }
            />
    )
}

export default TripsFeed