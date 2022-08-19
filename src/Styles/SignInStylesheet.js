import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#69876f",
      },
      header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
      },
      footer: {
        flex: 2,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
        
      },
    
      title: {
        color: "black",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: -15,
        marginBottom: 20,
      },
    
      input: {
        height: 40,
        margin: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
      },
    
      signUpText: {
        marginTop: 10,
        fontSize: 17,
        textAlign: "center",
        marginBottom: 5,
      },
    
      BAFLogo: {
        marginTop: 30,
        height: 90,
        width: 90,
        alignItems: "center",
      },
    
      Button: {
        alignItems: "center",
        color: "green",
        borderColor: "#fff",
      },
    
      ButtonText: {
        marginTop: 5,
        fontSize: 17,
        color: "white",
        borderStyle: 'solid',
        borderWidth: 1,
        margin: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: "#69876f",
        overflow: 'hidden',
        borderColor: 'white'
      },
      errorMessage: {
        color: "#FFa9a9",
        margin: 0,
    
        paddingHorizontal: 15,
        fontSize: 10,
      },

});