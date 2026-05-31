import { useState } from "react";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/authStore";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Please fill in all fields",
            });
            return;
        }

        try {
            await login(email.trim(), password);
            Toast.show({
                type: "success",
                text1: "Welcome back!",
                text2: "You are now signed in.",
            });
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Login Failed",
                text2: error?.message ?? "Something went wrong",
            });
        }
    };

    return { email, setEmail, password, setPassword, handleLogin, isLoading };
};
