import React from 'react'
import {View,Image, Dimensions, StyleSheet} from "react-native"
import VideoPlayer from "react-native-video-player"

const windowWidth = Dimensions.get('window').width * 0.75
const windowHeight = Dimensions.get('window').height * 0.5

const MediaItem = ({data}) => {
    const split = data.type.split("/")
    const type = split[0]
    return (
           <View style={styles.content}>
                {type === 'video' && <>
                    <View style={styles.media}>
                    <VideoPlayer
                        video={{uri: data.url}}
                        videoWidth={windowWidth}
                        videoHeight={windowHeight}
                        thumbnail={{uri: data.url}}
                    />
                    </View>
                </>}
                {type !== 'video' && <>
                    <Image
                        source={{uri: data.url}}
                        style={styles.mediaImg}/>
                </>}
           </View>
    )
}
const styles = StyleSheet.create({
    content: {
        marginTop: 30,
        alignItems: 'center'
    },
    media: {
        width: windowWidth,
        height: windowHeight
    },
    mediaImg: {
        width: windowWidth,
        height: windowHeight,
        resizeMode: 'cover'
    }
})


export default MediaItem