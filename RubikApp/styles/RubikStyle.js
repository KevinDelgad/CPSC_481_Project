import { StyleSheet } from "react-native";

export default rubikStyle = StyleSheet.create({
    textInput : {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "60%"
    },
      button: {
        marginVertical: 10, // Add margin between the two buttons
      },
      verticalSpace: {
        height: 10, // Add vertical space between the two buttons
      },
      rubikFaceInput: {
        height: "60%",
        width: '70%',
        backgroundColor : "red"
      },
      rubikLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }


});