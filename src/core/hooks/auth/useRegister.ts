import { useState } from "react";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/authStore";

export const useRegister = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register, isLoading } = useAuthStore();

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Please fill in all fields",
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Passwords do not match",
            });
            return;
        }

        try {
            await register(name, email, password);
            Toast.show({
                type: "success",
                text1: "Registration Successful",
                text2: "Welcome to Petzy!",
            });
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Registration Failed",
                text2: error.message || "Something went wrong",
            });
        }
    };

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleRegister,
        isLoading,
    };
};
