import React from "react"
import { FlatList, SafeAreaView, RefreshControl } from "react-native"
import HomeFeedItem from "./HomeFeedItem"
import Helper from "../helpers/Helper";

const HomeFeed = ({data, extra, navigation, refresh, onRefresh}) => {
    return (
        <SafeAreaView>
            <FlatList
                data={data.sort((a, b) => {
                    if (a && b) {
                        return a.timestampStart < b.timestampStart ? 1 : -1
                    }
                })}
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
