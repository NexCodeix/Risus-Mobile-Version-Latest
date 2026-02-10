import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
} from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import { loginRequest } from "@/services/auth.service";

export default function SignIn() {
    const login = useAuthStore.getState().login
    const isLoading = useAuthStore((s) => s.isLoading);

    const fetchUser = useUserStore((s) => s.fetchUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Missing fields");
        }

        try {
            const data = await loginRequest(email, password);
            useAuthStore.getState().login(data.key)
            router.replace("/"); // go to app
        } catch (err: any) {
            Alert.alert("Login failed", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <Pressable
                style={[styles.button, isLoading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? "Signing in..." : "Sign In"}
                </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/signup")}>
                <Text style={styles.link}>
                    Don&apos;t have an account? Sign up
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 32,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
    },

    button: {
        backgroundColor: "#111",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },

    link: {
        marginTop: 18,
        textAlign: "center",
        color: "#555",
    },
});
