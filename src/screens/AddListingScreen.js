import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Picker,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Formik, setIn } from "formik";
import * as yup from "yup";
import { useIsFocused } from "@react-navigation/native";
import { authContext } from "../services/contexts/AuthProvider";
//styles
import { COLORS, styles } from "../Styles/StyleSheet";
import ValidationError from "../components/ValidationError";

import { Animated } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import PaymentModal from "../components/paymentComponent/PaymentModal";

const validationSchema = yup.object({
  title: yup
    .string()
    .min("10", "The title is too short")
    .max("40", "The title is too long")
    .required("Required"),
  make: yup
    .string()
    .max("15", "The make is too long")
    .required("Required"),
  model: yup
    .string()
    .max("40", "The model is too long")
    .required("Required"),
  year: yup
    .number()
    .test("len", "Required", (val) => {
      if (val) {
        if (val.toString().length === 4) return true;
      } else return false;
    })
    .required("Required"),
  driverL: yup
    .string()
    .min("6", "Enter a valid driver's license number")
    .max("15", "The driver's license number is too long")
    .required("Required"),
  vin: yup.string().min("16", "Enter a valid VIN").required("Required"),
  price: yup.number().positive().required("Enter a price"),
  desc: yup
    .string()
    .min("15", "Please enter at least 15 characters.")
    .max("300", "The maximum characters for description is 300")
    .required("Required"),
  features: yup
    .string()
    .min("15", "Please enter at least 15 characters.")
    .max("300", "The maximum characters for features is 300")
    .required("Required"),

    city: yup
      .string()
      .min("2", "Please enter a valid City.")
      .max("17", "The city must be under 17 characters")
      .required("Required"),
    state: yup
      .string()
      .min("2", "Please enter a valid State.")
      .max("2", "Please enter a valid State.")
      .required("Required"),
      minimumPrice: yup
      .string()
      .test("hund", "Must be a multiple of 100", (val) => {
        if (val) {
          if( parseInt(val.replace(/,/g, '')) % 100 == 0) return true
          else return false
        }
      })
      .required("Required"),


});

const Progress = ({ step, steps, height }) => {
  const [width, setWidth] = React.useState(0);
  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);

  return (
    <>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;

          setWidth(newWidth);
        }}
        style={{
          height,
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: height,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height,
            width: "100%",
            borderRadius: height,
            backgroundColor: COLORS.Secondary,
            position: "relative",
            left: 0,
            top: 0,
            transform: [
              {
                translateX: animatedValue,
              },
            ],
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "900",
          marginBottom: 6,
          textAlign: "center",
        }}
      >
        {/* {step}/{steps} */}
      </Text>
    </>
  );
};

const AddListingScreen = (props) => {
  const { currentUser } = useContext(authContext);
  const [isNotValid, setIsNotValid] = useState(true);
  const [index, setIndex] = React.useState(1);
  const [modalOpen, setmodalOpen] = useState(false);
  const [listing, setListing] = useState({
    seller: {
      id: currentUser?._id,
      username: currentUser?.username,
      push: currentUser?.pushToken,
    },
  });

  useEffect(() => {
    if (props.route.params) {
      if (props.route.params.images) {
        setListing({ ...listing, images: props.route.params.images });
      } else if (props.route.params.driverLicense) {
        setListing({
          ...listing,
          driverLicense: props.route.params.driverLicense[0],
        });
      } else if (props.route.params.carTitle) {
        setListing({ ...listing, carTitle: props.route.params.carTitle[0] });
      }
    }
  }, [useIsFocused()]);
  return (
    <>
      <View style={{ flex: 1 }}>
        <ProgressSteps
          marginBottom={-55}
          topOffset={0}
          borderWidth={0}
          activeLabelColor={"transparent"}
          activeStepNumColor={"transparent"}
          activeStepIconBorderColor={"transparent"}
          completedLabelColor={"transparent"}
          completedStepNumColor={"transparent"}
          completedIconBorderColor={"transparent"}
          completedStepIconColor={"transparent"}
          disabledStepIconColor={"transparent"}
          disabledLabelColor={"transparent"}
          disabledStepNumColor={"transparent"}
        >
          <ProgressStep
            scrollable={true}
            overflow={true}
            label=""
            nextBtnDisabled={isNotValid}
            nextBtnStyle={styles.btns}
            nextBtnTextStyle={{
              color: COLORS.white,
              textAlign: "center",
              fontSize: 15,
            }}
            onNext={() => {
              setListing({
                ...listing,
                title: `${listing.year} ${listing.make} ${listing.model}`,
              });
              setIndex(index + 1);
            }}
          >
            <Text style={styles.stepTitle}>Enter Vehicle Information</Text>
            <KeyboardAvoidingView
              enabled={Platform.OS === "ios"}
              behavior="padding"
              keyboardVerticalOffset={70}
            >
              <View style={{ alignItems: "center" }}>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    make: "",
                    model: "",
                    year: "",
                    driverL: "",
                    vin: "",
                    price: "",
                    desc: "",
                    features: "",
                    city: "",
                    state: "",
                    minimumPrice: "",
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => {
                    useEffect(() => {

                      if (
                        errors.year ||
                        errors.make ||
                        errors.vin ||
                        errors.model ||
                        errors.city ||
                        errors.state ||
                        errors.minimumPrice ||
                        errors.features ||
                        errors.desc || 
                        values.year === "" ||
                        values.make === "" ||
                        values.vin === "" ||
                        values.model === "" ||
                        values.city === "" ||
                        values.state === "" ||
                        values.minimumPrice === "" ||
                        values.features === "" ||
                        values.desc === ""
                      ) {
                        setIsNotValid(true);
                      } else {
                        setIsNotValid(false);
                      }

                    }, [errors]);
                    return (
                      <View
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          marginTop: 0,
                          width: "95%",
                        }}
                      >
                        <View
                          style={{
                            marginTop: 0,
                            width: "100%",
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              marginRight: 10,
                              width: "31.5%",
                            }}
                          >
                            <Text style={styles.italic}>
                              {errors.year && touched.year ? (
                                <ValidationError error={errors.year} />
                              ) : (
                                <></>
                              )}
                            </Text>
                            <Text style={styles.formTitle}>
                              Vehicle Year *{"\t\t"}
                            </Text>

                            <TextInput
                              style={styles.textInputs}
                              keyboardType="number-pad"
                              onChangeText={(value) => {
                                handleChange("year")(value);
                                setListing({ ...listing, year: value });
                              }}
                              onBlur={handleBlur("year")}
                              placeholder="2022"
                              maxLength={4}
                            />
                          </View>

                          <View
                            style={{
                              flexDirection: "column",
                              marginRight: 10,
                              width: "31.5%",
                            }}
                          >
                            <Text style={styles.italic}>
                              {errors.make && touched.make ? (
                                <ValidationError error={errors.make} />
                              ) : (
                                <></>
                              )}
                            </Text>
                            <Text style={styles.formTitle}>
                              Vehicle Make *{"\t\t"}
                            </Text>

                            <TextInput
                              style={styles.textInputs}
                              onChangeText={(value) => {
                                handleChange("make")(value);
                                setListing({ ...listing, make: value });
                              }}
                              onBlur={handleBlur("make")}
                              placeholder="Ford"
                            />
                          </View>

                          <View
                            style={{ flexDirection: "column", width: "31.5%" }}
                          >
                            <Text style={styles.italic}>
                              {errors.model && touched.model ? (
                                <ValidationError error={errors.model} />
                              ) : (
                                <></>
                              )}
                            </Text>
                            <Text style={styles.formTitle}>
                              Vehicle Model *{"\t\t"}
                            </Text>
                            <TextInput
                              style={styles.textInputs}
                              onChangeText={(value) => {
                                handleChange("model")(value);
                                setListing({ ...listing, model: value });
                              }}
                              onBlur={handleBlur("model")}
                              placeholder="Fusion"
                            />
                          </View>
                        </View>

                        <Text style={styles.formTitle}>
                          Vehicle VIN Number *{"\t\t"}
                          <Text style={styles.italic}>
                            {errors.vin && touched.vin ? (
                              <ValidationError error={errors.vin} />
                            ) : (
                              <></>
                            )}
                          </Text>
                        </Text>
                        <TextInput
                          style={styles.textInputs}
                          onChangeText={(value) => {
                            handleChange("vin")(value);
                            setListing({ ...listing, VIN: value });
                          }}
                          onBlur={handleBlur("vin")}
                          placeholder="e.g. 4Y1SL65848Z411439"
                          maxLength={17}
                        />

                        <View
                          View
                          style={{
                            marginTop: 0,
                            width: "100%",
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              marginRight: 10,
                              width: "48.8%",
                            }}
                          >
                            <Text style={styles.formTitle}>
                              City *{"\t\t"}
                              <Text style={styles.italic}>
                                {errors.city && touched.city ? (
                                  <ValidationError error={errors.city} />
                                ) : (
                                  <></>
                                )}
                              </Text>
                            </Text>
                            <TextInput
                              style={styles.textInputs}
                              onChangeText={(value) => {
                                handleChange("city")(value);
                                setListing({ ...listing, city: value });
                              }}
                              onBlur={handleBlur("city")}
                              placeholder="Dearborn"
                            />
                          </View>

                          <View
                            style={{
                              flexDirection: "column",
                              marginRight: 10,
                              width: "48.8%",
                            }}
                          >
                            <Text style={styles.formTitle}>
                              State *{"\t\t"}
                              <Text style={styles.italic}>
                                {errors.state && touched.state ? (
                                  <ValidationError error={errors.state} />
                                ) : (
                                  <></>
                                )}
                              </Text>
                            </Text>
                            <TextInput
                              style={styles.textInputs}
                              onChangeText={(value) => {
                                handleChange("state")(value);
                                setListing({ ...listing, state: value });
                              }}
                              onBlur={handleBlur("state")}
                              placeholder="MI"
                              maxLength={2}
                            />
                          </View>
                        </View>

                        <Text style={styles.formTitle}>

                          Minimum Selling Price *{"\t\t"}
                          <Text style={styles.italic}>
                            {errors.minimumPrice && touched.minimumPrice ? (
                              <ValidationError error={errors.minimumPrice} />
                            ) : (
                              <></>
                            )}
                          </Text>
                        </Text>
                        <TextInput
                          style={styles.textInputs}
                          onChangeText={(value) => {
                            handleChange("minimumPrice")(value);
                            setListing({ ...listing, minimumPrice:  parseInt(value.replace(/,/g, '')) });
                          }}
                          onBlur={handleBlur("minimumPrice")}
                          placeholder="e.g. xxx,x00"
                          maxLength={17}
                        />


                        <Text style={styles.formTitle}>
                          Description{"\t\t"}
                          <Text style={styles.italic}>
                            {errors.desc && touched.desc ? (
                              <ValidationError error={errors.desc} />
                            ) : (
                              <></>
                            )}
                          </Text>
                        </Text>
                        <TextInput
                          multiline={true}
                          numberOfLines={10}
                          style={styles.textArea}
                          onChangeText={(value) => {
                            handleChange("desc")(value);
                            let FormattedDesc = value.replace("\n", " ");
                            setListing({
                              ...listing,
                              description: FormattedDesc,
                            });
                          }}
                          onBlur={handleBlur("desc")}
                          placeholder="e.g. My car is red"
                        />
                        <Text style={styles.formTitle}>
                          Features{"\t\t"}
                          <Text style={styles.italic}>
                            {errors.features && touched.features ? (
                              <ValidationError error={errors.features} />
                            ) : (
                              <></>
                            )}
                          </Text>
                        </Text>

                        <TextInput
                          multiline={true}
                          numberOfLines={10}
                          style={styles.textArea}
                          onChangeText={(value) => {
                            handleChange("features")(value);
                            let FormattedFeatures = value.replace("\n", " ");
                            setListing({
                              ...listing,
                              features: FormattedFeatures,
                            });
                          }}
                          onBlur={handleBlur("features")}
                          placeholder="e.g. Heated Seats"
                        />
                      </View>
                    );
                  }}
                </Formik>
              </View>
            </KeyboardAvoidingView>
          </ProgressStep>
          <ProgressStep
            onSubmit={() => {
              console.log("fggfgffg");
              // setmodalOpen(true);

              props.navigation.navigate("finishScreen", {
                listingData: listing,
              });
              // if(modalOpen === false)
              // {
              //   props.navigation.navigate("finishScreen", {
              //     listingData: listing,
              //   });
              // }

            }}
            label=""
            previousBtnTextStyle={{
              color: COLORS.white,
              textAlign: "center",
              fontSize: 15,
            }}
            previousBtnStyle={styles.btns}
            nextBtnStyle={styles.btns}
            nextBtnTextStyle={{
              color: COLORS.white,
              textAlign: "center",
              fontSize: 15,
            }}
            onNext={() => {
              // checkInfo();
              setmodalOpen(true);

            }}
            onPrevious={() => setIndex(index - 1)}
          >
            <Text style={styles.stepTitle}>Image Uploads</Text>

            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.Secondary,
                  fontSize: 16,
                }}
              >
                Upload Vehicle Images
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.Secondary,
                  fontSize: 10,
                  marginBottom: 10,
                }}
              >
                Min. 1/Max. 15 photos
              </Text>
              <View style={styles.listingSlider}>
                {listing.images?.length > 0 && (
                  <SliderBox
                    sliderBoxHeight={120}
                    images={listing.images}
                    dotStyle={{ display: "none" }}
                    resizeMode={"contain"}
                  />
                )}
              </View>
              <Button
                color={COLORS.Secondary}
                title="Select Photos"
                onPress={() =>
                  props.navigation.navigate("photo library", {
                    imagesFor: "images",
                  })
                }
              />

              <Text style={styles.stepTitleSmall}>Upload Vehicle Title</Text>
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.Secondary,
                  fontSize: 10,
                  marginBottom: 10,
                }}
              >
                Min./Max. 1
              </Text>
              <View style={styles.listingSlider}>
                {listing.carTitle && (
                  <Image
                    source={{ uri: listing.carTitle }}
                    resizeMode="stretch"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </View>
              <Button
                color={COLORS.Secondary}
                title="Select Photos"
                onPress={() =>
                  props.navigation.navigate("photo library", {
                    imagesFor: "carTitle",
                  })
                }
              />

              <Text style={styles.stepTitleSmall}>Upload Driver's License</Text>
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.Secondary,
                  fontSize: 10,
                  marginBottom: 10,
                }}
              >
                Min./Max. 1
              </Text>
              <View style={styles.listingSlider}>
                {listing.driverLicense && (
                  <Image
                    source={{ uri: listing.driverLicense }}
                    resizeMode="stretch"
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </View>
              <Button
                color={COLORS.Secondary}
                title="Select Photos"
                onPress={() =>
                  props.navigation.navigate("photo library", {
                    imagesFor: "driverLicense",
                  })
                }
              />
            </View>
          </ProgressStep>
          {/* <ProgressStep
            onSubmit={() => {
              console.log("GFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFsdfd");
              props.navigation.navigate("finishScreen", {
                listingData: listing,
              });
            }}
            label=""
            onNext={() => setIndex(index + 1)}
            onPrevious={() => setIndex(index - 1)}
            previousBtnTextStyle={{
              color: COLORS.white,
              textAlign: "center",
              fontSize: 15,
            }}
            previousBtnStyle={styles.btns}
            nextBtnStyle={styles.btns}
            nextBtnTextStyle={{
              color: COLORS.white,
              textAlign: "center",
              fontSize: 15,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  flex: 1,
                  width: "80%",
                }}
              >
                <Formik
                  initialValues={{
                    price: "",
                  }}
                >
                  {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignContent: "center",
                        marginTop: 0,
                      }}
                    >
                      <Text style={styles.stepTitle}>Payment Information</Text>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </ProgressStep> */}
        </ProgressSteps>

        <View style={{ marginBottom: -52 }}></View>

        <View style={styles.container}>
          <Progress step={index} steps={3} height={3} />
        </View>

        <PaymentModal visible = {modalOpen} closeModal={() => setmodalOpen(false)} bidInfo={[listing._id, listing.price]}/>

      </View>
    </>
  );
};

export default AddListingScreen;
