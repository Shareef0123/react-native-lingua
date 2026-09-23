import { images } from "@/constants/images";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Platform, Text, TouchableOpacity, View } from "react-native";

type OAuthStrategy = "oauth_google" | "oauth_facebook" | "oauth_apple";

// Required for the OAuth redirect to complete and dismiss the web browser.
WebBrowser.maybeCompleteAuthSession();

// Warming up the browser makes the Android OAuth sheet open noticeably faster.
function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export default function SocialAuthButtons() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [pending, setPending] = useState<OAuthStrategy | null>(null);

  const handleSSO = useCallback(
    async (strategy: OAuthStrategy) => {
      try {
        setPending(strategy);
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/home");
        }
      } catch {
        Alert.alert(
          "Sign in failed",
          "Could not complete social sign in. Make sure this provider is enabled in your Clerk dashboard."
        );
      } finally {
        setPending(null);
      }
    },
    [startSSOFlow, router]
  );

  return (
    <View className="space-y-3 mb-4">
      {/* Google */}
      <TouchableOpacity
        onPress={() => handleSSO("oauth_google")}
        disabled={pending !== null}
        activeOpacity={0.8}
        className="border border-[#E5E7EB] rounded-[20px] py-3.5 px-4 flex-row items-center justify-center bg-white"
      >
        <Image
          source={images.googleIcon}
          style={{ width: 20, height: 20, position: "absolute", left: 20 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[15px] text-[#0D132B]">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity
        onPress={() => handleSSO("oauth_facebook")}
        disabled={pending !== null}
        activeOpacity={0.8}
        className="border border-[#E5E7EB] rounded-[20px] py-3.5 px-4 flex-row items-center justify-center bg-white mt-2.5"
      >
        <Image
          source={images.facebookIcon}
          style={{ width: 20, height: 20, position: "absolute", left: 20 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-[15px] text-[#0D132B]">
          Continue with Facebook
        </Text>
      </TouchableOpacity>

      {/* Apple — iOS only */}
      {Platform.OS === "ios" && (
        <TouchableOpacity
          onPress={() => handleSSO("oauth_apple")}
          disabled={pending !== null}
          activeOpacity={0.8}
          className="border border-[#E5E7EB] rounded-[20px] py-3.5 px-4 flex-row items-center justify-center bg-white mt-2.5"
        >
          <Image
            source={images.appleIcon}
            style={{ width: 20, height: 20, position: "absolute", left: 20 }}
            resizeMode="contain"
          />
          <Text className="font-poppins-semibold text-[15px] text-[#0D132B]">
            Continue with Apple
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
