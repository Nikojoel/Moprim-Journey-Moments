import React, {useState} from 'react';
import {Text, View, Button, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Upload = () => {
  const [image, setImage] = useState(null);

  const pickImage = () => {
    const options = {
      title: 'Select Photo',
      customButtons: [{name: 'Custom', title: 'Custom button'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('cancel');
      } else if (response.error) {
        console.log('error');
      } else if (response.customButton) {
        //: TODO Add functionality for custom button
        console.log('custom button');
      } else {
        console.log('success, uri:', response.uri);
        setImage(response.uri);
      }
    });
  };

  const uploadFile = async (uri) => {
    const arr = uri.split('/');
    const imgName = arr[arr.length - 1];

    const reference = storage().ref(`Media/${imgName}`);
    const path = `${uri}`;

    const task = reference.putFile(path);

    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      setImage(
        (
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
        ).toFixed(1) + '% completed',
      );
    });

    task.then(() => {
      console.log('Image uploaded to the bucket!');
      setImage('Uploaded to the bucket');
    });
  };

  const getFile = async (uri) => {
    //: TODO Get specific file from FireBase
  };

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
              await uploadFile(image);
            }}
          />
          <Image source={{uri: image}} style={{width: 250, height: 250}} />
        </View>
      )}
    </View>
  );
};

export default Upload;
