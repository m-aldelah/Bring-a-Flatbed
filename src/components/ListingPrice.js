import React from "react";
import { View, Text, TextInput } from "react-native";
import { COLORS, styles } from '../Styles/StyleSheet';
import { Formik } from 'formik';

import Button from "../components/Button";


const ListingPrice = (props) => {
    return (
        <View style={{
            flex: 1, width: '80%'
        }}>
            <Formik
                initialValues={{
                    price: '',
                }
                }
                onSubmit={values => console.log(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={{
                        flex: 1, justifyContent: 'center', alignContent: 'center', marginTop: 30,
                    }}>
                        <Text>Choose a starting Price:</Text>
                        <TextInput
                            style={styles.textInputs}
                            onChangeText={handleChange('price')}
                            onBlur={handleBlur('price')}
                            value={values.price}
                        />

                    </View>
                )}
            </Formik>
        </View >
    );
};

export default ListingPrice;
