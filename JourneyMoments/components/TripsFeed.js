import React from "react"
import { FlatList, SafeAreaView, StatusBar, TouchableOpacity } from "react-native"
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base"
import InnerChainItem from "../components/InnerChainItem";

const TripsFeed = ({data, extra, navigation}) => {
    
    return (
        <FlatList
                data={data}
                renderItem={({item}) =>
                    <InnerChainItem data={item}  navigation={navigation}/>     
                }
                keyExtractor={data.key}
                extraData={extra}
            />
    )
}

export default TripsFeed