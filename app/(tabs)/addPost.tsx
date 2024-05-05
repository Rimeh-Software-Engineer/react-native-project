import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { Formik } from "formik";
import { TextInput } from "react-native";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Page = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Formik
        initialValues={{
          title: "",
          desc: "",
          category: "",
          address: "",
          price: "",
          image: "",
        }}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <TouchableOpacity onPress={() => console.log("Image Click")}>
              <MaterialCommunityIcons
                name="image-edit"
                size={60}
                color={Colors.secondary}
                style={{ marginBottom: 20 }}
              ></MaterialCommunityIcons>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={values.title}
              onChangeText={handleChange("title")}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={values.desc}
              numberOfLines={8}
              onChangeText={handleChange("desc")}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={values.price}
              keyboardType="number-pad"
              onChangeText={handleChange("price")}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={values.address}
              onChangeText={handleChange("address")}
            ></TextInput>
            <View style={styles.pickerInput}>
              <Picker
                selectedValue={values.category}
                onValueChange={handleChange("category")}
              >
                <Picker.Item
                  label="Dropdown"
                  value={"Dropdown"}
                  style={{ textAlignVertical: "top" }}
                />
              </Picker>
            </View>
            <TouchableOpacity
              style={[styles.btnOutline, defaultStyles.btn]}
              onPress={handleSubmit}
            >
              <Text style={[styles.btnOutlineText, defaultStyles.btnText]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 50,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 17,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 17,
    backgroundColor: "#fff",
    fontSize: 17,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
