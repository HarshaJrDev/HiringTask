import React, { useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Checkbox from "expo-checkbox";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// Validation schema
const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must contain at least 8 characters"),
});

const FormComponent = () => {
  const [isChecked, setChecked] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onPressSend = (formData: any) => {
    console.log("Form Submitted:", formData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Email Field */}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        {/* Password Field */}
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={value}
              onChangeText={onChange}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
            />
          )}
          name="password"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        {/* Remember Me Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text style={styles.checkboxLabel}>Remember me!</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onPressSend)}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#475",
  },
  formContainer: {
    marginHorizontal: SCREEN_HEIGHT * 0.02,
    marginTop: SCREEN_HEIGHT * 0.4,
  },
  input: {
    borderWidth: 0.4,
    paddingLeft: 20,
    borderRadius: 5,
    height: 40,
    backgroundColor: "#fff",
  },
  passwordInput: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  checkbox: {
    height: 20,
    width: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#fff",
  },
  loginButton: {
    marginTop: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#d1d1d1",
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
    borderRadius: 5,
  },
  loginButtonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default FormComponent;
