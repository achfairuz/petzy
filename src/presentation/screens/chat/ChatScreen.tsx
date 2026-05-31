import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {ScreenHeader} from "@/presentation/components/ScreenHeader";
import {ChatThread} from "@/domain/entities/Chat";
import {getChatThreadsUseCase} from "@/domain/usecases/ChatUseCases";
import {chatRepository} from "@/data/repositories/chatRepository";
import {formatRelativeTime} from "@/core/utils/format";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getThreads = getChatThreadsUseCase(chatRepository);

const ChatScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getThreads()
      .then(setThreads)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="Messages"
        subtitle="Chat with vets, groomers & trainers"
      />

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{marginTop: 60}} />
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: Spacing.xxl,
            paddingBottom: 120,
            gap: Spacing.sm,
          }}
          renderItem={({item}) => (
            <ThreadRow
              thread={item}
              onPress={() =>
                navigation.navigate("ChatRoom", {
                  threadId: item.id,
                  name: item.name,
                  avatarUrl: item.avatarUrl,
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const ThreadRow: React.FC<{thread: ChatThread; onPress: () => void}> = ({
  thread,
  onPress,
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
    <View>
      <Image source={{uri: thread.avatarUrl}} style={styles.avatar} />
      {thread.online ? <View style={styles.online} /> : null}
    </View>
    <View style={{flex: 1}}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{thread.name}</Text>
        <Text style={styles.time}>
          {formatRelativeTime(thread.lastSentAtISO)}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.preview} numberOfLines={1}>
          {thread.lastMessage}
        </Text>
        {thread.unreadCount > 0 ? (
          <View style={styles.unread}>
            <Text style={styles.unreadText}>{thread.unreadCount}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.role}>{thread.role}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  row: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.md,
    elevation: 1,
  },
  avatar: {width: 56, height: 56, borderRadius: BorderRadius.full},
  online: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: 2,
  },
  preview: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  unread: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
  },
  role: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
    marginTop: 2,
  },
});

export default ChatScreen;
