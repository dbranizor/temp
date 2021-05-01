// Import React
import React, {useState} from 'react';
import RNFetchBlob from 'react-native-fetch-blob'
import RNFS from 'react-native-fs';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { RestClient } from './RestClient';

const restClient = new RestClient();
const App = () => {
  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {     
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('base64 -> ', response.base64);
        console.log('uri -> ', response.uri);
        console.log('width -> ', response.width);
        console.log('height -> ', response.height);
        console.log('fileSize -> ', response.fileSize);
        console.log('type -> ', response.type);
        console.log('fileName -> ', response.fileName);
        setFilePath(response);
      });
    }
  };

  // const dirPicutures = `${RNFS.ExternalStorageDirectoryPath}/Pictures`;
  const dirPicutures = `/storage/emulated/0/Pictures`;
  const chooseFile = (type) => {
    let options = {
      includeBase64: true, 
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      // console.log('base64? -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);

      const physicalPath = `${dirPicutures}/${response.fileName}`;
      const exists = await RNFS.exists(physicalPath)

      console.log('dingo does this image exist?', exists)
      const serverStatus = await restClient.post('http://71.191.250.113:3000/images',{
        name: response.fileName,
        content: response.base64,
        stuff: '7minutes',
        fileType: response.type,
        id: Math.random() * 777788228
      })
      console.log('dingo got server response', serverStatus)
      if(serverStatus){
        const result = await RNFS.unlink(response.uri)
        // console.log('dingo file result', result)
        console.log('FILE DELETED', response.uri, response.fileName);
      }
     
      // setFilePath(response);
    });
  };

  const completeImagery = async () => {
    let serverStatus
    try {
      serverStatus = await restClient.get('http://71.191.250.113:3000/images/complete?stuff=7minutes');
    } catch (error) {
      throw new Error('Error Setting Imagery to Complete', error)
    }
     
    console.log('Server Imagery Set to Complete', serverStatus)
  }

  const deployModel = async () => {
    let serverStatus
    try {
      serverStatus = await restClient.get('http://71.191.250.113:3000/images/deploy?stuff=7minutes');
    } catch (error) {
      throw new Error('Error Setting Imagery to Complete', error)
    }
     
    console.log('Server Imagery Set to Complete', serverStatus)
  }

  const deleteStaging = async () => {
    let serverStatus
    try {
      serverStatus = await restClient.delete('http://71.191.250.113:3000/images?stuff=7minutes');
    } catch (error) {
      throw new Error('Error Setting Imagery to Complete', error)
    }
     
    console.log('Server Imagery Set to Complete', serverStatus)
  }


  const backupImages = async () => {
    let serverStatus
    try {
      serverStatus = await restClient.get('http://71.191.250.113:3000/images/backup?stuff=7minutes');
    } catch (error) {
      throw new Error('Error Setting Imagery to Complete', error)
    }
     
    console.log('Server Imagery Set to Complete', serverStatus)
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Example of Image Picker in React Native
      </Text>
      <View style={styles.container}>
        {/* <Image
          source={{
            uri: 'data:image/jpeg;base64,' + filePath.data,
          }}
          style={styles.imageStyle}
        /> */}
        <Image
          source={{uri: filePath.uri}}
          style={styles.imageStyle}
        />
        <Text style={styles.textStyle}>{filePath.uri}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => completeImagery()}>
          <Text style={styles.textStyle}>Build Model</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => deployModel()}>
          <Text style={styles.textStyle}>Deploy Model</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => backupImages()}>
          <Text style={styles.textStyle}>Backup Images in Bucket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => deleteStaging()}>
          <Text style={styles.textStyle}>Delete Staging Images</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});