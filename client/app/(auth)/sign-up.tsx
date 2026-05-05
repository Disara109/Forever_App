import { useState, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp, useAuth } from "@clerk/expo";
import { COLORS } from "@/constants";
import { valueFromTextInputRef } from "@/utils/webTextInput";
import { ClerkSignUpCaptcha } from "@/components/ClerkSignUpCaptcha";

function formatClerkError(e: { longMessage?: string; message?: string } | null | undefined, fallback: string) {
    if (!e) return fallback;
    return (e.longMessage || e.message || fallback).trim();
}

export default function SignUpScreen() {
    const { isLoaded: authReady } = useAuth();
    const { signUp } = useSignUp();
    const router = useRouter();

    const firstNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignUpPress = async () => {
        if (!authReady || !signUp) {
            Toast.show({
                type: "info",
                text1: "Please wait",
                text2: "Authentication is still loading…",
            });
            return;
        }

        const first = valueFromTextInputRef(firstNameRef, firstName).trim();
        const last = valueFromTextInputRef(lastNameRef, lastName).trim();
        const email = valueFromTextInputRef(emailRef, emailAddress).trim();
        const pass = valueFromTextInputRef(passwordRef, password);

        if (!email || !pass) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in email and password'
            });
            return;
        }

        // Let Cloudflare Turnstile finish any pending UI before we set loading (avoids invalidating the challenge).
        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => resolve());
            });
        });

        setLoading(true);
        try {
            const { error: createErr } = await signUp.create({
                emailAddress: email,
                password: pass,
                firstName: first,
                lastName: last,
            });

            if (createErr) {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Sign Up',
                    text2: formatClerkError(createErr, "Something went wrong"),
                });
                return;
            }

            const { error: sendErr } = await signUp.verifications.sendEmailCode();
            if (sendErr) {
                Toast.show({
                    type: 'error',
                    text1: 'Could not send code',
                    text2: formatClerkError(sendErr, "Try again shortly"),
                });
                return;
            }

            setPendingVerification(true);
        } finally {
            setLoading(false);
        }
    };

    const backFromVerification = async () => {
        if (signUp) {
            const { error } = await signUp.reset();
            if (error) {
                console.warn("signUp.reset", error);
            }
        }
        setCode("");
        setPendingVerification(false);
    };

    const onVerifyPress = async () => {
        if (!code) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Enter verification code'
            });
            return;
        }

        if (!signUp) return;

        setLoading(true);
        try {
            const { error: verifyErr } = await signUp.verifications.verifyEmailCode({ code });

            if (verifyErr) {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Verify',
                    text2: formatClerkError(verifyErr, "Invalid code"),
                });
                return;
            }

            if (signUp.status === "complete") {
                const { error: finErr } = await signUp.finalize();
                if (finErr) {
                    Toast.show({
                        type: 'error',
                        text1: 'Could not finish sign-up',
                        text2: formatClerkError(finErr, "Try again"),
                    });
                    return;
                }
                router.replace("/");
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Verification incomplete'
                });
            }
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
            {!pendingVerification ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
                        <Text className="text-secondary">Sign up to get started</Text>
                    </View>

                    {/* First Name */}
                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">First Name</Text>
                        <TextInput ref={firstNameRef} className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="John" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} autoComplete="given-name" textContentType="givenName" />
                    </View>

                    {/* Last Name */}
                    <View className="mb-6">
                        <Text className="text-primary font-medium mb-2">Last Name</Text>
                        <TextInput ref={lastNameRef} className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="Doe" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} autoComplete="family-name" textContentType="familyName" />
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">Email</Text>
                        <TextInput ref={emailRef} className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} autoComplete="email" textContentType="emailAddress" />
                    </View>

                    {/* Password */}
                    <View className="mb-2">
                        <Text className="text-primary font-medium mb-2">Password</Text>
                        <TextInput ref={passwordRef} className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} autoComplete="new-password" textContentType="newPassword" />
                    </View>

                    <ClerkSignUpCaptcha />

                    {/* Submit — keep layout stable so Turnstile above isn’t reflowed */}
                    <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center justify-center mb-10" style={{ minHeight: 52 }} onPress={onSignUpPress} disabled={loading}>
                        <View style={{ position: "relative", minHeight: 26, width: "100%", alignItems: "center", justifyContent: "center" }}>
                            <Text className="text-white font-bold text-lg" style={{ opacity: loading ? 0 : 1 }}>Continue</Text>
                            {loading ? (
                                <View style={{ position: "absolute", left: 0, right: 0, alignItems: "center" }} pointerEvents="none">
                                    <ActivityIndicator color="#fff" />
                                </View>
                            ) : null}
                        </View>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Already have an account? </Text>
                        <Link href="/sign-in">
                            <Text className="text-primary font-bold">Login</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={backFromVerification}
                        className="absolute top-12 left-0 z-50 p-2"
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Verification */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
                        <Text className="text-secondary text-center">Enter the code sent to your email</Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center" onPress={onVerifyPress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}
