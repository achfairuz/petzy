import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useRoute, RouteProp} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/core/theme";
import {Badge} from "@/presentation/components/Badge";
import {Article} from "@/domain/entities/Article";
import {getArticleByIdUseCase} from "@/domain/usecases/ArticleUseCases";
import {articleRepository} from "@/data/repositories/articleRepository";
import type {AppStackParamList} from "@/presentation/navigation/types";

const getArticle = getArticleByIdUseCase(articleRepository);

type Route = RouteProp<AppStackParamList, "ArticleDetail">;

const SAMPLE_BODY = [
  "Pets thrive on routine. Establishing fixed feeding, walking, and playtime hours helps them feel safe and reduces anxiety.",
  "Regular check-ups are key. A visit to the vet every six months catches issues early — long before they become painful or costly.",
  "Mental stimulation matters as much as exercise. Puzzle feeders, scent work, and short training sessions keep your buddy sharp and content.",
  "Above all, give them your time. The bond you build today will outlive any treat or toy.",
];

const ArticleDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const {articleId} = route.params;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticle(articleId)
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator color={Colors.primary} style={{marginTop: 80}} />
      </SafeAreaView>
    );
  }
  if (!article) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Article not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 60}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={{uri: article.coverUrl}} style={styles.cover} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Badge label={article.category} />
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={styles.meta}>{article.minutesRead} min read</Text>
          </View>

          <Text style={styles.excerpt}>{article.excerpt}</Text>

          {SAMPLE_BODY.map((p, idx) => (
            <Text key={idx} style={styles.para}>
              {p}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.background},
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
  hero: {position: "relative"},
  cover: {width: "100%", height: 260},
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    marginTop: -24,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    gap: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  metaRow: {flexDirection: "row", alignItems: "center", gap: 4},
  meta: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  excerpt: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  para: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});

export default ArticleDetailScreen;
