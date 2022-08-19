import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#69876f",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  footer: {
    flex: 3,
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
  },
  text: {
    color: "grey",
    marginTop: 5,
    textAlign: "center",
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
  username: {
    height: 40,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#d1d1d1",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    color: "#7E7E7E",
    marginBottom: 15
  },
  ProfilePicture: {
    height: 90,
    width: 90,
    paddingTop: 100,
    marginTop: 10,
    borderRadius: 90 / 2,
    borderWidth: 1,
    borderColor: "#ccc",

    overflow: "hidden",
  },
  firstLastName: {
    flexDirection: "column",
    paddingHorizontal: 15,
    flex: 1,

    // width: 240,
  },

  pfpAndName: {
    paddingTop: 20,

    flexDirection: "row",
  },

  signInText: {
    marginTop: 5,
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

  TAC: {
    paddingBottom: 10,
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
    flexDirection: 'row',
  },

  TACLink: {
    paddingTop: 3,
    color: "dodgerblue",
    textDecorationLine: "underline",
    fontSize: 12,
    marginBottom: -2,
  },

  errorMessage: {
    color: "#FFa9a9",
    margin: 0,

    paddingHorizontal: 15,
    fontSize: 10,
  },


  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  headerTAC: {
    width: "100%",
    height: 40,
    marginTop: -20,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  city: {
    width: 150,
    marginRight: 1,
  },
  state: {
    width: 70,
    margin: 1,
    marginTop: 5
  },
  zip: {
    width: 100,
    margin: 1,
    marginTop: 5

  },
  address: {
    flexDirection: "row",
  },


});
