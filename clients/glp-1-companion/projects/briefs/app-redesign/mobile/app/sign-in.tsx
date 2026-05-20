import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "@/constants/colors";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = Colors.light;

  const handleEmailSignIn = useCallback(async () => {
    if (!isLoaded || !email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        strategy: "email_code",
      });

      if (result.status === "needs_first_factor") {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: result.supportedFirstFactors?.find(
            (f) => f.strategy === "email_code"
          )?.emailAddressId!,
        });
        setPendingVerification(true);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, email, signIn]);

  const handleVerifyCode = useCallback(async () => {
    if (!isLoaded || !code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)/today");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, code, signIn, setActive, router]);

  const handleGoogleSSO = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const { createdSessionId, setActive: ssoSetActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await ssoSetActive!({ session: createdSessionId });
        router.replace("/(tabs)/today");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, startSSOFlow, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          gap: 24,
        }}
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins-Bold",
              color: colors.primary,
            }}
          >
            GLP-1 Companion
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter",
              color: colors.mutedForeground,
              marginTop: 8,
            }}
          >
            Track your journey, understand your progress
          </Text>
        </View>

        {!pendingVerification ? (
          <>
            {/* Google SSO */}
            <Pressable
              onPress={handleGoogleSSO}
              disabled={loading}
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter-Medium",
                  color: colors.foreground,
                }}
              >
                Continue with Google
              </Text>
            </Pressable>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter",
                  color: colors.mutedForeground,
                }}
              >
                or
              </Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
            </View>

            {/* Email input */}
            <View style={{ gap: 12 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  fontFamily: "Inter",
                  color: colors.foreground,
                }}
              />
              <Pressable
                onPress={handleEmailSignIn}
                disabled={loading || !email.trim()}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  opacity: loading || !email.trim() ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Inter-SemiBold",
                      color: colors.primaryForeground,
                    }}
                  >
                    Continue with Email
                  </Text>
                )}
              </Pressable>
            </View>
          </>
        ) : (
          /* Verification code input */
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter",
                color: colors.foreground,
                textAlign: "center",
              }}
            >
              Enter the code sent to {email}
            </Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Verification code"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              autoFocus
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                fontSize: 20,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
                textAlign: "center",
                letterSpacing: 4,
              }}
            />
            <Pressable
              onPress={handleVerifyCode}
              disabled={loading || !code.trim()}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                opacity: loading || !code.trim() ? 0.6 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter-SemiBold",
                    color: colors.primaryForeground,
                  }}
                >
                  Verify
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setPendingVerification(false);
                setCode("");
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter",
                  color: colors.primary,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Use a different email
              </Text>
            </Pressable>
          </View>
        )}

        {/* Error message */}
        {error ? (
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter",
              color: colors.error,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
