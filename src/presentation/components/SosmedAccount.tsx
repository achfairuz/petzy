import {Colors, iconSizes} from "@/core/theme";
import {AntDesign} from "@expo/vector-icons";
import {View, TouchableOpacity} from "react-native";
import {StyleSheet} from "react-native";

export default function SosmedAccount() {
  return (
    <View style={styles.container}>
      {/* Tambahkan ikon dan tombol untuk akun sosial media */}
      <TouchableOpacity style={styles.icon}>
        {/* Tambahkan ikon atau teks di sini */}
        <AntDesign name="google" size={iconSizes.medium} color={Colors.black} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        {/* Tambahkan ikon atau teks di sini */}
        <AntDesign name="apple" size={iconSizes.medium} color={Colors.black} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        {/* Tambahkan ikon atau teks di sini */}
        <AntDesign name="x" size={iconSizes.medium} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15, // kalau ga support, pakai margin
    marginBottom: 40,
  },
  icon: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3, // shadow Android
  },
});
