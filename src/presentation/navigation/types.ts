import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type AppTabParamList = {
    Home: undefined;
    Health: undefined;
    Shop: undefined;
    Chat: undefined;
    Profile: undefined;
};

export type AppStackParamList = {
    Tabs: NavigatorScreenParams<AppTabParamList>;

    // Shop
    Cart: undefined;
    ProductDetail: { productId: string };
    Checkout: undefined;
    OrderSuccess: { orderId: string; total: number };

    // Chat
    ChatRoom: { threadId: string; name: string; avatarUrl: string };

    // Pets
    MyPets: undefined;
    PetDetail: { petId: string };
    PetForm: { petId?: string } | undefined;

    // Health
    BookAppointment: { vetId?: string } | undefined;
    VetDetail: { vetId: string };
    Appointments: undefined;
    AppointmentDetail: { appointmentId: string };
    ArticleDetail: { articleId: string };

    // Profile
    EditProfile: undefined;
    Addresses: undefined;
    AddressForm: { addressId?: string } | undefined;
    PaymentMethods: undefined;
    Settings: undefined;
    Help: undefined;
    About: undefined;

    Notifications: undefined;
};
