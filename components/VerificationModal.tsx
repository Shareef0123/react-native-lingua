import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SymbolView } from "expo-symbols";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email?: string;
  // Verify the 6-digit code. Throw (or reject) to show an error; the caller
  // handles navigation on success.
  onVerify: (code: string) => Promise<void>;
  onResend?: () => void;
}

export default function VerificationModal({
  visible,
  onClose,
  email,
  onVerify,
  onResend,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setError(null);
      setCode("");
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [visible]);

  const submit = async (value: string) => {
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    try {
      await onVerify(value);
      // On success the caller navigates away; nothing else to do here.
    } catch (e) {
      setCode("");
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Invalid or expired code. Please try again."
      );
      setTimeout(() => inputRef.current?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text: string) => {
    if (loading) return;
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(numericText);
    if (error) setError(null);
    if (numericText.length === 6) {
      void submit(numericText);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(13, 19, 43, 0.6)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%", maxWidth: 400, alignItems: "center" }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-[28px] p-6 shadow-2xl"
            style={{
              shadowColor: "#0D132B",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Top Close Button */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-poppins-bold text-[22px] text-[#0D132B]">
                Verify Code
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <SymbolView
                  name="xmark"
                  size={14}
                  weight="bold"
                  tintColor="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Description Copy */}
            <Text className="font-poppins text-[14px] text-[#6B7280] leading-[20px] mb-6">
              We&apos;ve sent a 6-digit verification code to{" "}
              <Text className="font-poppins-semibold text-[#0D132B]">
                {email && email.trim() !== "" ? email : "your email address"}
              </Text>
              . Enter it below to complete authentication.
            </Text>

            {/* Hidden Input & Visible 6 Boxes */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="relative py-2 mb-2"
            >
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  zIndex: 10,
                }}
                caretHidden={true}
              />

              <View className="flex-row justify-between items-center px-1">
                {Array.from({ length: 6 }).map((_, index) => {
                  const digit = code[index] || "";
                  const isFocused =
                    code.length === index ||
                    (code.length === 6 && index === 5);

                  return (
                    <View
                      key={index}
                      className={`w-[45px] h-[54px] rounded-2xl items-center justify-center border-2 ${
                        digit
                          ? "border-[#5B3BF6] bg-[#F5F3FF]"
                          : isFocused
                          ? "border-[#5B3BF6] bg-white shadow-sm"
                          : "border-gray-200 bg-[#F9FAFB]"
                      }`}
                    >
                      <Text className="font-poppins-bold text-[22px] text-[#0D132B]">
                        {digit}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>

            {/* Loading / Error state */}
            {loading ? (
              <View className="flex-row items-center justify-center mt-2">
                <ActivityIndicator color="#5B3BF6" />
                <Text className="font-poppins text-[13px] text-[#6B7280] ml-2">
                  Verifying…
                </Text>
              </View>
            ) : error ? (
              <Text className="font-poppins-medium text-[13px] text-[#EF4444] text-center mt-2">
                {error}
              </Text>
            ) : null}

            {/* Footer / Resend prompt */}
            <View className="items-center mt-3">
              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  if (onResend) onResend();
                  inputRef.current?.focus();
                }}
              >
                <Text className="font-poppins-medium text-[14px] text-[#5B3BF6]">
                  Didn&apos;t receive code? Resend
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
