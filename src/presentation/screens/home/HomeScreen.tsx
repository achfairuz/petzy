import React from "react";
import {ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {Colors, Spacing} from "../../../core/theme";
import type {AppStackParamList} from "../../navigation/types";
import PetCareList, {
  HeaderContent,
  HeaderHome,
  HomeBanner,
  HomeCategories,
  HomeFeaturedPets,
  HomePetCareTips,
  HomeSearch,
  HomeServices,
} from "./components";
import {HomeStyles} from "./home.styles";

const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <SafeAreaView style={HomeStyles.safeArea} edges={["top"]}>
      <ScrollView
        style={HomeStyles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={HomeStyles.scrollContent}
      >
        <HeaderHome />
        <HomeSearch />
        <HomeBanner />

        <HeaderContent
          title="Categories"
          onPress={() => navigation.navigate("Tabs", {screen: "Shop"})}
        />
        <HomeCategories />

        <View
          style={{
            backgroundColor: Colors.white,
            paddingTop: Spacing.xl,
            paddingBottom: 100,
          }}
        >
          <HeaderContent title="Services" />
          <HomeServices />

          <HeaderContent
            title="Featured Pets"
            onPress={() => navigation.navigate("MyPets")}
          />
          <HomeFeaturedPets />

          <HeaderContent
            title="Pet Care Tips"
            onPress={() => navigation.navigate("Tabs", {screen: "Health"})}
          />
          <HomePetCareTips />

          <HeaderContent
            title="Pet Care"
            onPress={() => navigation.navigate("BookAppointment")}
          />
          <PetCareList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
