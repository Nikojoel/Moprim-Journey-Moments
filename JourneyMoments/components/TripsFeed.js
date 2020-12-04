import React from "react"
import {FlatList, RefreshControl, SafeAreaView} from "react-native"
import InnerChainItem from "../components/InnerChainItem"
import Helper from "../helpers/Helper"

const TripsFeed = ({data, extra, navigation, refresh, onRefresh}) => {

    return (
        <SafeAreaView>
        <FlatList
            data={data}
            renderItem={({item}) =>
                <InnerChainItem data={item} navigation={navigation}/>
            }
            keyExtractor={item => Helper.generateUUID()}
            extraData={extra}
            numColumns={2}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh}/>
            }
        />
        </SafeAreaView>
    )
}

export default TripsFeed