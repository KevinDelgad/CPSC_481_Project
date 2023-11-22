import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Button,
  TouchableHighlight,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as React from 'react';
import * as FS from 'expo-file-system';

import RubikStyle from '../styles/RubikStyle';

export default PastAttempt = () => {
  const [curMode, setCurMode] = React.useState('Image');

  const [saveImageFront, setSaveImageFront] = React.useState('Front');
  const [saveImageTop, setSaveImageTop] = React.useState('Top');
  const [saveImageBack, setSaveImageBack] = React.useState('Back');
  const [saveImageLeft, setSaveImageLeft] = React.useState('Left');
  const [saveImageRight, setSaveImageRight] = React.useState('Right');
  const [saveImageBottom, setSaveImageBottom] = React.useState('Bottom');

  const [imageValues, setImageValues] = React.useState({
    front: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'],
    top: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'],
    back: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'],
    bottom: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'],
    left: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'],
    right: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey'],
  });

  const [curFace, setCurFace] = React.useState('front');

  const [uploadPossible, setUploadPossible] = React.useState(true);

  const takeImage = async setRubikSide => {
    const image = await ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    });
    setRubikSide(image.path);
  };

  const uploadImages = async () => {
    await this.toServer({
      base64: true,
      uri: saveImageFront,
    });

    await this.toServer({
      base64: true,
      uri: saveImageTop,
    });

    await this.toServer({
      base64: true,
      uri: saveImageBack,
    });

    await this.toServer({
      base64: true,
      uri: saveImageBottom,
    });

    await this.toServer({
      base64: true,
      uri: saveImageLeft,
    });

    let result = await this.toServer({
      base64: true,
      uri: saveImageRight,
    });
  };

  React.useEffect(() => {
    // Check if all state variables have changed
    const allChanged =
      saveImageFront !== 'Front' &&
      saveImageBack !== 'Back' &&
      saveImageBottom !== 'Bottom' &&
      saveImageLeft !== 'Left' &&
      saveImageRight !== 'Right' &&
      saveImageTop !== 'Top';

    if (allChanged) {
      // Do something when all state variables have changed
      setUploadPossible(!uploadPossible);
    }
  }, [
    saveImageFront,
    saveImageTop,
    saveImageBack,
    saveImageLeft,
    saveImageRight,
    saveImageBottom,
  ]);

  React.useEffect(() => {
    
  }, [imageValues]);

  toServer = async mediaFile => {
    (route = '/image'), (content_type = 'image/jpeg');
    url = 'http://192.168.1.234:5000/image';
    let response = await FS.uploadAsync(url, mediaFile.uri, {
      headers: {
        'content-type': content_type,
      },
      httpMethod: 'POST',
      uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    });

    console.log(response.headers);
    console.log(response.body);

    setImageValues(response.body);
  };

  const checkImageIsValid = val => {
    return val.length > 10;
  };

  const changeColor = (curColor, position) => {
    colorOrder = ['red', 'orange', 'yellow', 'green', 'blue', 'white'];
    const tempImageVal = {...imageValues};
    if(curColor === 'grey'){
      tempImageVal[curFace][position] = colorOrder[0]
    }else{
      for(i = 0; i < colorOrder.length; i++){
        if(curColor === colorOrder[i] && i+1 < colorOrder.length){
          tempImageVal[curFace][position] = colorOrder[i + 1]
          break
        }else if(colorOrder[i] === 'white'){
          tempImageVal[curFace][position] = colorOrder[0];
          break
        }
      }
    }

    setImageValues(tempImageVal);
  };

  const GridFace = () => {
    return (
      <View style={RubikStyle.rubikFaceInput}>
        <View style={RubikStyle.rubikLayout}>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][0], 0)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][0],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][1], 1)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][1],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][2], 2)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][2],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={RubikStyle.rubikLayout}>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][3], 3)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][3],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][4], 4)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][4],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][5], 5)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][5],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={RubikStyle.rubikLayout}>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][6], 6)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][6],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][7], 7)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][7],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeColor(imageValues[curFace][8], 8)}>
            <View
              style={{
                backgroundColor: imageValues[curFace][8],
                flex: 1,
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text> </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {curMode === 'image' && (
        <>
          <FlatList
            style={styles.list}
            data={[
              [saveImageFront, setSaveImageFront],
              [saveImageBack, setSaveImageBack],
              [saveImageTop, setSaveImageTop],
              [saveImageLeft, setSaveImageLeft],
              [saveImageRight, setSaveImageRight],
              [saveImageBottom, setSaveImageBottom],
            ]}
            horizontal
            renderItem={({item}) => (
              <TouchableWithoutFeedback onPress={() => takeImage(item[1])}>
                {checkImageIsValid(item[0]) ? (
                  <Image source={{uri: item[0]}} style={styles.image} />
                ) : (
                  <Text style={styles.image}>{item[0]}</Text>
                )}
              </TouchableWithoutFeedback>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
          />

          <Button
            title="Upload Images"
            disabled={uploadPossible}
            onPress={() => {
              uploadImages();
            }}
            style={styles.button}
          />
        </>
      )}

      {curMode !== 'image' && (
        <>
          <GridFace />
        </>
      )}

      <Button
        title="Switch Mode"
        style={styles.button}
        onPress={() => {
          curMode === 'image' ? setCurMode('manual') : setCurMode('image');
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexGrow: 0,
    height: '30%',
    marginVertical: 0, // Adjust the vertical margin as needed
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 10, // Adjust the horizontal margin between items
  },
  button: {
    marginTop: 20, // Adjust the margin from the list
  },
});
