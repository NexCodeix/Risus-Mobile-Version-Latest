import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Logic Imports
import AppKeyboardAvoidingView from "@/components/ui/AppKeyboardAvoidingView";
import AppScreen from "@/components/ui/AppScreen";
import { useAuth } from "@/hooks/useAuth";
import { AppToast } from "@/components/ui/AppToast";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isSignupLoading } = useAuth()

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      return Alert.alert("Missing fields", "Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Password mismatch", "Passwords do not match");
    }

    setIsLoading(true);
    try {
      await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        password1: password,
        password2: confirmPassword
      });
      AppToast.success({ title: "Signup Successful!", description: "Please log in to get your information." })
      router.replace("/(auth)/signin");
    } catch (err: any) {
      setIsLoading(false);
      AppToast.error({ title: "Signup Failed!", description: err?.message || "Something went wrong!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={['#CCFBF1', '#E0F2FE', '#F1F5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0"
      />

      <AppScreen>
        <AppKeyboardAvoidingView>
          <View className="flex-1">
            {/* TOP NAVIGATION BAR - Fixed */}
            <View className="flex-row items-center justify-between pt-3 pb-4">
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <ChevronLeft color="#334155" size={28} />
              </TouchableOpacity>
              <View className="flex-row items-center bg-white/40 px-4 py-2 rounded-full border border-white/60">
                <Text className="text-slate-600 mr-2 text-xs font-medium">Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/signin")}>
                  <Text className="text-blue-600 font-bold text-xs">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LOGO - Fixed */}
            <Animated.View entering={FadeInDown.delay(200).duration(800)} className="items-center mt-3 mb-4">
              <Image
                source={require("@/assets/main-header-logo.png")}
                style={{ width: 140, height: 50, resizeMode: 'contain' }}
              />
            </Animated.View>

            {/* MAIN GLASS CARD WITH SCROLLABLE CONTENT */}
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              className="flex-1 rounded-[48px] overflow-hidden border border-white/80 shadow-2xl shadow-black/5"
            >
              <BlurView intensity={100} tint="light" className="flex-1 bg-white/40">
                <ScrollView
                  contentContainerStyle={{ padding: 32, paddingBottom: 40 }}
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                >
                  <Text className="text-3xl font-bold text-slate-800 text-center">Create Account</Text>
                  <Text className="text-slate-500 text-center mt-2 mb-8 font-medium">Let&apos;s get started!</Text>

                  {/* NAME FIELDS */}
                  <View className="mb-5 flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1 mb-2">First Name</Text>
                      <View className="flex-row items-center border-b border-slate-200 py-3">
                        <User size={20} color="#64748b" strokeWidth={1.5} />
                        <TextInput
                          placeholder="John"
                          placeholderTextColor="#94a3b8"
                          autoCapitalize="words"
                          className="flex-1 ml-3 text-slate-800 font-medium text-base"
                          value={firstName}
                          onChangeText={setFirstName}
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1 mb-2">Last Name</Text>
                      <View className="flex-row items-center border-b border-slate-200 py-3">
                        <User size={20} color="#64748b" strokeWidth={1.5} />
                        <TextInput
                          placeholder="Doe"
                          placeholderTextColor="#94a3b8"
                          autoCapitalize="words"
                          className="flex-1 ml-3 text-slate-800 font-medium text-base"
                          value={lastName}
                          onChangeText={setLastName}
                        />
                      </View>
                    </View>
                  </View>

                  {/* EMAIL */}
                  <View className="mb-5">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1 mb-2">Email Address</Text>
                    <View className="flex-row items-center border-b border-slate-200 py-3">
                      <Mail size={20} color="#64748b" strokeWidth={1.5} />
                      <TextInput
                        placeholder="johndoe@gmail.com"
                        placeholderTextColor="#94a3b8"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="flex-1 ml-3 text-slate-800 font-medium text-base"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>

                  {/* PHONE NUMBER */}
                  <View className="mb-5">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1 mb-2">Phone Number</Text>
                    <View className="flex-row items-center border-b border-slate-200 py-3">
                      <Phone size={20} color="#64748b" strokeWidth={1.5} />
                      <TextInput
                        placeholder="+1234567890"
                        placeholderTextColor="#94a3b8"
                        keyboardType="phone-pad"
                        className="flex-1 ml-3 text-slate-800 font-medium text-base"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                  </View>

                  {/* PASSWORD */}
                  <View className="mb-5">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1 mb-2">Password</Text>
                    <View className="flex-row items-center border-b border-slate-200 py-3">
                      <Lock size={20} color="#64748b" strokeWidth={1.5} />
                      <TextInput
                        placeholder="••••••••••••"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={!showPassword}
                        className="flex-1 ml-3 text-slate-800 font-medium text-base"
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* CONFIRM PASSWORD */}
                  <View className="mb-8">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1 mb-2">Confirm Password</Text>
                    <View className="flex-row items-center border-b border-slate-200 py-3">
                      <Lock size={20} color="#64748b" strokeWidth={1.5} />
                      <TextInput
                        placeholder="••••••••••••"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={!showConfirmPassword}
                        className="flex-1 ml-3 text-slate-800 font-medium text-base"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                      />
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* SIGN UP BUTTON */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    <View className="rounded-2xl overflow-hidden">
                      <LinearGradient
                        colors={['#7494EC', '#5C7FE7']}
                        className="py-5 items-center shadow-lg shadow-blue-400"
                      >
                        <Text className="text-white font-bold text-lg">
                          {isSignupLoading ? "Creating Account..." : "Sign Up"}
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  {/* SOCIAL LOGIN DIVIDER */}
                  <View className="flex-row items-center my-8">
                    <View className="flex-1 h-[1px] bg-slate-200" />
                    <Text className="mx-4 text-slate-400 font-medium">Or sign up with</Text>
                    <View className="flex-1 h-[1px] bg-slate-200" />
                  </View>

                  {/* GOOGLE SIGN UP */}
                  <TouchableOpacity className="flex-row items-center justify-center border border-slate-200 py-4 rounded-2xl bg-white/50">
                    <Image
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.png' }}
                      className="w-5 h-5 mr-3"
                    />
                    <Text className="text-slate-700 font-bold">Sign up with Google</Text>
                  </TouchableOpacity>
                </ScrollView>
              </BlurView>
            </Animated.View>
          </View>
        </AppKeyboardAvoidingView>
      </AppScreen>
    </View>
  );
}