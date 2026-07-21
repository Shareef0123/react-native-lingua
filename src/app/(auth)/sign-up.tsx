import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);

  const handleSignUp = () => {
    setVerificationModalVisible(true);
  };

  const handleSocialAuth = () => {
    setVerificationModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-2 pb-6 justify-between">
            {/* Header section */}
            <View>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="w-10 h-10 items-center justify-center -ml-2 mb-2 rounded-full"
              >
                <SymbolView
                  name="chevron.left"
                  size={20}
                  weight="bold"
                  tintColor="#0D132B"
                />
              </TouchableOpacity>

              <Text className="font-poppins-bold text-[28px] text-[#0D132B] tracking-tight">
                Create your account
              </Text>
              <Text className="font-poppins text-[15px] text-[#6B7280] mt-1">
                Start your language journey today ✨
              </Text>
            </View>

            {/* Mascot Image */}
            <View className="items-center justify-center my-4 min-h-[140px] max-h-[180px]">
              <Image
                source={images.mascotAuth}
                style={{ width: "100%", height: 160 }}
                resizeMode="contain"
              />
            </View>

            {/* Form Section */}
            <View className="space-y-3.5 mb-2">
              {/* Email Input */}
              <View
                className={`border rounded-[20px] px-4 py-2 bg-[#FAFAFC] ${
                  isEmailFocused
                    ? "border-[#5B3BF6] bg-white shadow-sm"
                    : "border-[#E5E7EB]"
                }`}
              >
                <Text className="font-poppins-medium text-[11px] text-[#6B7280]">
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="alex@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Regular",
                    color: "#0D132B",
                    paddingVertical: 2,
                  }}
                />
              </View>

              {/* Password Input */}
              <View
                className={`border rounded-[20px] px-4 py-2 bg-[#FAFAFC] mt-3.5 flex-row items-center justify-between ${
                  isPasswordFocused
                    ? "border-[#5B3BF6] bg-white shadow-sm"
                    : "border-[#E5E7EB]"
                }`}
              >
                <View className="flex-1 pr-2">
                  <Text className="font-poppins-medium text-[11px] text-[#6B7280]">
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={{
                      fontSize: 15,
                      fontFamily: "Poppins-Regular",
                      color: "#0D132B",
                      paddingVertical: 2,
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  className="p-1"
                >
                  <SymbolView
                    name={showPassword ? "eye.slash" : "eye"}
                    size={20}
                    tintColor="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Main Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                activeOpacity={0.85}
                className="bg-[#5B3BF6] rounded-[22px] py-4 items-center justify-center mt-5"
                style={{
                  shadowColor: "#5B3BF6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="font-poppins-semibold text-[17px] text-white">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-3">
              <View className="flex-1 h-[1px] bg-[#E5E7EB]" />
              <Text className="mx-3 font-poppins text-[13px] text-[#6B7280]">
                or continue with
              </Text>
              <View className="flex-1 h-[1px] bg-[#E5E7EB]" />
            </View>

            {/* Social Auth Buttons */}
            <View className="space-y-3 mb-4">
              {/* Google */}
              <TouchableOpacity
                onPress={handleSocialAuth}
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
                onPress={handleSocialAuth}
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

              {/* Apple */}
              <TouchableOpacity
                onPress={handleSocialAuth}
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
            </View>

            {/* Bottom Navigation Link */}
            <View className="flex-row items-center justify-center pt-2">
              <Text className="font-poppins text-[14px] text-[#6B7280]">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/sign-in")}
                activeOpacity={0.7}
              >
                <Text className="font-poppins-semibold text-[14px] text-[#5B3BF6]">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal */}
      <VerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        email={email}
      />
    </SafeAreaView>
  );
}
