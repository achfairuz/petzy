import React, {useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ChatMessage} from "@/domain/entities/Chat";
import {
  getChatMessagesUseCase,
  sendChatMessageUseCase,
} from "@/domain/usecases/ChatUseCases";
import {chatRepository} from "@/data/repositories/chatRepository";
import {formatTime} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getMessages = getChatMessagesUseCase(chatRepository);
const sendMessage = sendChatMessageUseCase(chatRepository);

const ChatRoomScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, "ChatRoom">>();
  const {threadId, name, avatarUrl} = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    getMessages(threadId).then(setMessages);
  }, [threadId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    const newMsg = await sendMessage(threadId, trimmed);
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(() => listRef.current?.scrollToEnd({animated: true}), 100);

    // simulate auto-reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `r-${Date.now()}`,
        threadId,
        fromMe: false,
        text: "Got it! I will follow up shortly.",
        sentAtISO: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Image source={{uri: avatarUrl}} style={styles.avatar} />
        <View style={{flex: 1}}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>Online</Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: Spacing.lg,
            gap: Spacing.sm,
          }}
          renderItem={({item}) => <Bubble message={item} />}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({animated: true})
          }
        />

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor={Colors.textDisabled}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && {opacity: 0.4}]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Bubble: React.FC<{message: ChatMessage}> = ({message}) => (
  <View
    style={[
      styles.bubble,
      message.fromMe ? styles.bubbleMe : styles.bubbleThem,
    ]}
  >
    <Text style={[styles.bubbleText, message.fromMe && {color: Colors.white}]}>
      {message.text}
    </Text>
    <Text
      style={[
        styles.bubbleTime,
        message.fromMe && {color: "rgba(255,255,255,0.7)"},
      ]}
    >
      {formatTime(message.sentAtISO)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    elevation: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  avatar: {width: 40, height: 40, borderRadius: BorderRadius.full},
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  status: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.success,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },

  bubble: {
    maxWidth: "80%",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xxl,
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Spacing.xs,
  },
  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Spacing.xs,
  },
  bubbleText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  bubbleTime: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    alignSelf: "flex-end",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatRoomScreen;
