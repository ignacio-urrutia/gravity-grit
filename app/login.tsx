import { Link, Redirect } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { UserContext } from "./context/userContext";

import Colors from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { TranslationContext } from "./context/translationProvider";

export default function Login() {
  const colorScheme = useColorScheme();
  const { translate } = useContext(TranslationContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const { user } = useContext(UserContext);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      alert(translate("login.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
          },
        ]}
      >
        {translate("login.title")}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"]
                .tabBackgroundColor,
          },
        ]}
        placeholder={translate("login.email")}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            backgroundColor:
              Colors[colorScheme === "light" ? "light" : "dark"]
                .tabBackgroundColor,
          },
        ]}
        placeholder={translate("login.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={signIn}
        disabled={loading}
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      >
        <Text>{translate("login.login")}</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: Colors.grey,
            },
          ]}
        />
        <Text
          style={{
            color: Colors[colorScheme === "light" ? "light" : "dark"].text,
            marginHorizontal: 10,
          }}
        >
          {translate("login.or")}
        </Text>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: Colors.grey,
            },
          ]}
        />
      </View>
      <Link
        href="/signup"
        style={{
          color: Colors.primary,
        }}
      >
        {translate("login.signUp")}
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    margin: 6,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    width: "80%",
    margin: 6,
    padding: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  error: {
    color: "red",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "40%",
    marginHorizontal: 10,
  },
});
