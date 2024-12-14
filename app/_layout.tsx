import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as yup from "yup";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";

const { width, height } = Dimensions.get("window");
const scale = width / 375;
const moderateScale = (size: any, factor = 0.5) =>
  size + (scale - 1) * size * factor;

const App: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    const loadSavedEmail = async () => {
      const savedEmail = await AsyncStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    };
    loadSavedEmail();
  }, []);

  const loginValidationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const signUpValidationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must include an uppercase letter")
      .matches(/[a-z]/, "Must include a lowercase letter")
      .matches(/\d/, "Must include a number"),
  });

  const handleFormSubmit = async () => {
    try {
      const schema = isSignUp ? signUpValidationSchema : loginValidationSchema;
      await schema.validate({ email, password });

      setEmailError("");
      setPasswordError("");

      if (isSignUp) {
        Alert.alert("Sign Up Successful", `Welcome, ${email}!`);
      } else {
        Alert.alert("Login Successful", `Welcome back, ${email}!`);
        if (rememberMe) {
          await AsyncStorage.setItem("rememberedEmail", email);
        } else {
          await AsyncStorage.removeItem("rememberedEmail");
        }
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        if (error.path === "email") {
          setEmailError(error.message);
        } else if (error.path === "password") {
          setPasswordError(error.message);
        }
      }
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    if (!password) return "";
    const strength = ["Weak", "Medium", "Strong"];
    const rules = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[a-z]/.test(password),
    ];
    const passedRules = rules.filter(Boolean).length;
    setPasswordStrength(strength[Math.min(passedRules, 3) - 1]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          accessibilityLabel="Email Input"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
            evaluatePasswordStrength(text);
          }}
          accessibilityLabel="Password Input"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
          accessible={true}
          accessibilityLabel="Toggle Password Visibility"
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      {isSignUp && (
        <Text style={styles.passwordStrength}>
          Strength: {passwordStrength || ""}
        </Text>
      )}

      {!isSignUp && (
        <View style={styles.rememberMeContainer}>
          <Checkbox
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? '"#463"' : undefined}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
        <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don’t have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: moderateScale(20),
    backgroundColor: "#465",
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: moderateScale(20),
    textAlign: "center",
  },
  inputContainer: { marginBottom: moderateScale(15) },
  input: {
    borderWidth: 1,
    borderColor: "#0",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
  },
  errorText: {
    color: "red",
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
  },
  icon: {
    position: "absolute",
    right: moderateScale(10),
    top: moderateScale(15),
  },
  passwordStrength: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(10),
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(15),
  },
  rememberMeText: {
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },

  button: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    padding: moderateScale(15),
    alignItems: "center",
    height:moderateScale(50),width:moderateScale("100%")
  },
  buttonText: {
    color: "#000",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  toggleText: {
    color: '"#000"',
    textAlign: "center",
    marginTop: moderateScale(15),
  },
});

export default App;
