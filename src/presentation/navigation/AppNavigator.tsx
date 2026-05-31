import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import HomeScreen from "../screens/home/HomeScreen";
import HealthScreen from "../screens/health/HealthScreen";
import ShopScreen from "../screens/shop/ShopScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

import CartScreen from "../screens/shop/CartScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CheckoutScreen from "../screens/shop/CheckoutScreen";
import OrderSuccessScreen from "../screens/shop/OrderSuccessScreen";

import ChatRoomScreen from "../screens/chat/ChatRoomScreen";

import MyPetsScreen from "../screens/profile/MyPetsScreen";
import PetDetailScreen from "../screens/pets/PetDetailScreen";
import PetFormScreen from "../screens/pets/PetFormScreen";

import BookAppointmentScreen from "../screens/health/BookAppointmentScreen";
import VetDetailScreen from "../screens/health/VetDetailScreen";
import AppointmentsScreen from "../screens/health/AppointmentsScreen";
import AppointmentDetailScreen from "../screens/health/AppointmentDetailScreen";
import ArticleDetailScreen from "../screens/health/ArticleDetailScreen";

import EditProfileScreen from "../screens/profile/EditProfileScreen";
import AddressesScreen from "../screens/profile/AddressesScreen";
import AddressFormScreen from "../screens/profile/AddressFormScreen";
import PaymentMethodsScreen from "../screens/profile/PaymentMethodsScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import HelpScreen from "../screens/profile/HelpScreen";
import AboutScreen from "../screens/profile/AboutScreen";

import NotificationsScreen from "../screens/NotificationsScreen";

import CustomTabBar from "../components/CustomTabBar";
import type {AppStackParamList, AppTabParamList} from "./types";

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

const Tabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{headerShown: false}}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Health" component={HealthScreen} />
    <Tab.Screen name="Shop" component={ShopScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false, animation: "slide_from_right"}}
  >
    <Stack.Screen name="Tabs" component={Tabs} />

    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccessScreen}
      options={{animation: "fade"}}
    />

    <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />

    <Stack.Screen name="MyPets" component={MyPetsScreen} />
    <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    <Stack.Screen
      name="PetForm"
      component={PetFormScreen}
      options={{animation: "slide_from_bottom"}}
    />

    <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
    <Stack.Screen name="VetDetail" component={VetDetailScreen} />
    <Stack.Screen name="Appointments" component={AppointmentsScreen} />
    <Stack.Screen
      name="AppointmentDetail"
      component={AppointmentDetailScreen}
    />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />

    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Addresses" component={AddressesScreen} />
    <Stack.Screen
      name="AddressForm"
      component={AddressFormScreen}
      options={{animation: "slide_from_bottom"}}
    />
    <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="About" component={AboutScreen} />

    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
