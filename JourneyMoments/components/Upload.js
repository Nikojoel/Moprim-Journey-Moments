import React, {useState} from 'react'
import {Text, View, Alert, TouchableOpacity, StyleSheet} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import DownloadService from "../services/DownloadService"
import DatabaseService from "../services/DatabaseService"
import LoginService from "../services/LoginService"
import RNBottomActionSheet from 'react-native-bottom-action-sheet'
import Icon from 'react-native-vector-icons'
import {ProgressBar} from '@react-native-community/progress-bar-android'
import Colors from "../values/Colors";

const cameraIcon = <Icon family={'FontAwesome'} name={'camera'} color={'#000000'} size={30}/>
const videoIcon = <Icon family={'FontAwesome'} name={'video-camera'} color={'#000000'} size={30}/>
const libraryIcon = <Icon family={'FontAwesome'} name={'photo'} color={'#000000'} size={30}/>

const Upload = ({moprimId, handleUpload}) => {
    const [uploading, setUploading] = useState(false)
    const userId = LoginService.getCurrentUser().uid

    const videoOptions = {
        mediaType: 'video',
        isVideo: true,
        videoQuality: 'low',
        durationLimit: 15,
    }
    const imageOptions = {
        mediaType: 'image',
        isImage: true,
    }

    const showAlert = () => {
        Alert.alert(
            "Warning",
            "Choosing Google Photos might not work properly",
            [
                {
                    text: "Proceed",
                    onPress: () => launchFiles(imageOptions)
                },
                {
                    text: "Cancel",
                    style: "cancel"
                },
            ],
            {cancelable: false}
        )
    }

    const pickImage = () => {
        const sheetView = RNBottomActionSheet.SheetView
        sheetView.Show({
            title: "Choose format",
            items: [
                {title: "Image", value: "image", subTitle: "Image description", icon: cameraIcon},
                {title: "Video (15s max)", value: "video", subTitle: "Video Description", icon: videoIcon},
                {title: "Gallery", value: "image", subTitle: "Gallery description", icon: libraryIcon},
            ],
            theme: "light",
            selection: 3,
            onSelection: (index) => {
                if (index === 0) {
                    console.log("image")
                    launchCamera(imageOptions)
                } else if (index === 1) {
                    console.log("video")
                    launchCamera(videoOptions)
                } else {
                    console.log("gallery")
                    showAlert()
                }
            }
        })
    }

    const launchCamera = async (options) => {
        ImagePicker.launchCamera(options, (response => {
            if (response.didCancel) {
                console.log('cancel')
            } else if (response.error) {
                console.log('error')
            } else {
                console.log('success, uri:', response.uri)
                uploadFile(response.uri)
            }
        }))
    }

    const launchFiles = async (options) => {
        ImagePicker.launchImageLibrary(options, (response => {
            if (response.didCancel) {
                console.log('cancel')
            } else if (response.error) {
                console.log('error')
            } else {
                console.log('success, uri:', response.uri)
                uploadFile(response.uri)
            }
        }))
    }

    const uploadFile = async (uri) => {
        setUploading(true)
        const task = await DownloadService.dlINSERT(uri)
        console.log("task state: ", task)

        if (task.state === "success") {
            setUploading(false)
            const UUID = task.metadata.fullPath.split("/")[1]
            const url = await DownloadService.dlGetURL(UUID)
            const type = JSON.parse(JSON.stringify(task.metadata.contentType))

            const data = {
                "id": UUID,
                "moprimId": moprimId,
                "url": url,
                "userId": userId,
                "contentType": type
            }

            try {
                handleUpload()
                await DatabaseService.dbMediaINSERT(data)
                await DatabaseService.dbUserUPDATE(userId)
            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.btn} onPress={() => pickImage()}>
                <Text>ADD MEDIA</Text>
            </TouchableOpacity>
            {uploading && <>
                <Text>Uploading...</Text>
                <ProgressBar/>
            </>}
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        backgroundColor: Colors.secondaryColor,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default Upload;
