import { COLORS } from "@/constants";
import { useAuth, useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { valueFromTextInputRef } from "@/utils/webTextInput";

function formatClerkError(e: { longMessage?: string; message?: string } | null | undefined, fallback: string) {
    if (!e) return fallback;
    return (e.longMessage || e.message || fallback).trim();
}

export default function Page() {
    const { isLoaded: authReady } = useAuth();
    const { signIn } = useSignIn();
    const router = useRouter();

    const emailRef = React.useRef<TextInput>(null);
    const passwordRef = React.useRef<TextInput>(null);

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");
    const [showEmailCode, setShowEmailCode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignInPress = async () => {
        if (!authReady || !signIn) {
            Toast.show({
                type: "info",
                text1: "Please wait",
                text2: "Authentication is still loading…",
            });
            return;
        }

        const email = valueFromTextInputRef(emailRef, emailAddress).trim();
        const pass = valueFromTextInputRef(passwordRef, password);

        if (!email || !pass) {
            Toast.show({
                type: "error",
                text1: "Missing fields",
                text2: "Please enter your email and password",
            });
            return;
        }

        setLoading(true);

        try {
            const { error: createErr } = await signIn.create({
                identifier: email,
                password: pass,
            });

            if (createErr) {
                Toast.show({
                    type: "error",
                    text1: "Sign in failed",
                    text2: formatClerkError(createErr, "Check your details and try again"),
                });
                return;
            }

            if (signIn.status === "complete") {
                const { error: finErr } = await signIn.finalize();
                if (finErr) {
                    Toast.show({
                        type: "error",
                        text1: "Sign in failed",
                        text2: formatClerkError(finErr, "Could not complete session"),
                    });
                    return;
                }
                router.replace("/");
                return;
            }

            if (signIn.status === "needs_second_factor") {
                const { error: mfaErr } = await signIn.mfa.sendEmailCode();
                if (mfaErr) {
                    Toast.show({
                        type: "error",
                        text1: "Could not send code",
                        text2: formatClerkError(mfaErr, "Try again or use another sign-in method"),
                    });
                    return;
                }
                setShowEmailCode(true);
            }
        } catch (err) {
            console.error(err);
            Toast.show({
                type: "error",
                text1: "Sign in failed",
                text2: "Check your details and try again",
            });
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!code) {
            Toast.show({
                type: "error",
                text1: "Missing code",
                text2: "Enter the verification code from your email",
            });
            return;
        }

        if (!signIn) {
            return;
        }

        setLoading(true);
        try {
            const { error: verifyErr } = await signIn.mfa.verifyEmailCode({ code });
            if (verifyErr) {
                Toast.show({
                    type: "error",
                    text1: "Verification failed",
                    text2: formatClerkError(verifyErr, "Check the code and try again"),
                });
                return;
            }

            if (signIn.status === "complete") {
                const { error: finErr } = await signIn.finalize();
                if (finErr) {
                    Toast.show({
                        type: "error",
                        text1: "Sign in failed",
                        text2: formatClerkError(finErr, "Could not complete session"),
                    });
                    return;
                }
                router.replace("/");
            }
        } catch (err) {
            console.error(err);
            Toast.show({
                type: "error",
                text1: "Verification failed",
                text2: "Check the code and try again",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!authReady) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center" style={{ padding: 28 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-secondary mt-4">Loading…</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
            {!showEmailCode ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
                        <Text className="text-secondary">Sign in to continue</Text>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">Email</Text>
                        <TextInput ref={emailRef} className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} autoComplete="email" textContentType="emailAddress" />
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Text className="text-primary font-medium mb-2">Password</Text>
                        <TextInput ref={passwordRef} className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} autoComplete="current-password" textContentType="password" />
                    </View>

                    {/* Submit */}
                    <Pressable className={`w-full py-4 rounded-full items-center mb-10 ${loading ? "bg-gray-300" : "bg-primary"}`} onPress={onSignInPress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                    </Pressable>

                    {/* Footer */}
                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Don&apos;t have an account? </Text>
                        <Link href="/sign-up">
                            <Text className="text-primary font-bold">Sign up</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    {/* Verification */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
                        <Text className="text-secondary text-center">Enter the code sent to your email</Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    <Pressable className="w-full bg-primary py-4 rounded-full items-center" onPress={onVerifyPress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    );
}
