import React,{useState} from 'react';
import { Image,Platform,StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

//https://stackoverflow.com/questions/33595642/react-native-external-stylesheet


const App = () =>{
  const [selectedImage, setSelectedImage] = useState(null);

  const openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      console.log(selectedImage.remoteUri,'next', selectedImage.localUri) ;
      return;
    }

    Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri);
  };

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }

  };

  if (selectedImage !== null) {
    return (
        <View style={styles.container}>
          <Image
              source={{ uri: selectedImage.localUri }}
              style={styles.thumbnail}
          />

          <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
            <Text style={styles.buttonText}>Share this photo</Text>
          </TouchableOpacity>
        </View>
    );
  }
  console.log("Hey");
  return (
      <View style={styles.container}>
        <Image source={{ uri: "https://i.imgur.com/TkIrScD.png" }} style={styles.logo} />
        <Text style={styles.instructions} >To  a photo from your phone with a friend, just press the button below!</Text>
        <TouchableOpacity
            onPress={openImagePickerAsync}
            style={styles.buttonPickPhoto}>
          <Text style={styles.buttonPickPhoto__text}>Pick a photo</Text>
        </TouchableOpacity>
      </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  instructions:{
    color:'#888',
    fontSize: 18,
    marginHorizontal: 15
  },
  logo:{
    width: 300,
    height: 159,
    marginBottom: 10
  },
  buttonPickPhoto:{
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonPickPhoto__text:{
    fontSize: 20,
    color: '#fff'
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});

export default App;
