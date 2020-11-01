import React, {useState} from 'react'
import {Text, View, Button, Image} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import DownloadService from "../services/DownloadService"
import DatabaseService from "../services/DatabaseService"
import LoginService from "../services/LoginService";

const Upload = () => {
    const [image, setImage] = useState(null)
    const userId = LoginService.getCurrentUser().uid

    const pickImage = () => {
        const options = {
            title: 'Select Photo',
            customButtons: [
                {
                    name: 'Custom',
                    title: 'Custom button'
                }
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('cancel')
            } else if (response.error) {
                console.log('error')
            } else if (response.customButton) {
                //: TODO Add functionality for custom button
                console.log('custom button')
            } else {
                console.log('success, uri:', response.uri)
                setImage(response.uri)
            }
        })
    }

    const uploadFile = async (uri) => {
        const task = await DownloadService.dlINSERT(uri)
        console.log("task state: ", task)

        if (task.state === "success") {
            setImage('Uploaded to the bucket')
            const UUID = task.metadata.fullPath.split("/")[1]
            const url = await DownloadService.dlGetURL(UUID)

            const data = {
                "id": UUID,
                "moprimId": "test",
                "url": url,
                "userId": userId
            }
            await DatabaseService.dbMediaINSERT(data)
        }
    }

    return (
        <View>
            <Text>UPLOAD IMAGE</Text>
            <Button
                title="Choose"
                onPress={() => {
                    pickImage();
                }}
            />
            {image && (
                <View>
                    <Text>{image}</Text>
                    <Button
                        title="Upload"
                        onPress={async () => {
                            await uploadFile(image)
                        }}
                    />
                    <Image source={{uri: image}} style={{width: 250, height: 250}}/>
                </View>
            )}
        </View>
    );
};

export default Upload;
