import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@/core/theme";

type Props = {
  title: string;
  distance: string;
  reviews: string;
  image: string;
};

export const PetCareCard = ({title, distance, reviews, image}: Props) => {
  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <Image source={{uri: image}} style={styles.image} />

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* INFO ROW */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color="#FF6B6B" />
            <Text style={styles.infoText}>{distance}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="star-outline" size={16} color="#FF6B6B" />
            <Text style={styles.infoText}>{reviews}</Text>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 16,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  infoText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#F4A261",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 150,
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
});
