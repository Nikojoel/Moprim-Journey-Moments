import React from "react"
import {FlatList, RefreshControl, SafeAreaView} from "react-native"
import InnerChainItem from "../components/InnerChainItem"

const TripsFeed = ({data, extra, navigation, refresh, onRefresh}) => {

    return (
        <SafeAreaView>
        <FlatList
            data={data}
            renderItem={({item}) =>
                <InnerChainItem data={item} navigation={navigation}/>
            }
            keyExtractor={data.key}
            extraData={extra}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh}/>
            }
        />
        </SafeAreaView>
    )
}

export default TripsFeed