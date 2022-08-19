import React from "react";
import { View, Text, TextInput } from "react-native";
import { Formik } from "formik";

//components
import Button from "../components/Button";

//styles
import { COLORS, styles } from "../Styles/StyleSheet";

const ListingDetails = (props) => {
  return (
    <View
      style={{
        flex: 1,
        width: "80%",
      }}
    >
      <Formik
        initialValues={{
          make: "",
          model: "",
          year: "",
          vin: "",
          price: "",
          desc: "",
        }}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              marginTop: 30,
            }}
          >
            <TextInput
              style={styles.textInputs}
              onChangeText={handleChange("year")}
              onBlur={handleBlur("year")}
              value={values.year}
              placeholder="Year"
            />
            <TextInput
              style={styles.textInputs}
              onChangeText={handleChange("make")}
              onBlur={handleBlur("make")}
              value={values.email}
              placeholder="Make"
            />
            <TextInput
              style={styles.textInputs}
              onChangeText={handleChange("model")}
              onBlur={handleBlur("model")}
              value={values.email}
              placeholder="Model"
            />
            <TextInput
              style={styles.textInputs}
              onChangeText={handleChange("vin")}
              onBlur={handleBlur("vin")}
              value={values.email}
              placeholder="VIN"
            />
            <TextInput
              multiline={true}
              numberOfLines={10}
              style={styles.textArea}
              onChangeText={handleChange("desc")}
              onBlur={handleBlur("desc")}
              value={values.email}
              placeholder="Description"
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ListingDetails;
