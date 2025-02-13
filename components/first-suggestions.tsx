"use client";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import * as AC from "@bacons/apple-colors";
import { PromptOnTap } from "./prompt-on-tap";

export function FirstSuggestions() {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        paddingHorizontal: 16,
      }}
    >
      {(
        [
          "What is a flashcard?",
          "Study methods",
          "How to create decks?",
        ]
      ).map((title, index) => (
        <Animated.View
          entering={FadeInDown.delay((3 - index) * 100)}
          key={String(index)}
        >
          <PromptOnTap
            key={String(index)}
            style={{}}
            activeOpacity={0.7}
            prompt={title}
          >
            <View style={[styles.suggestion]}>
              <Text
                style={{
                  color: AC.label,
                  fontSize: 16,
                }}
              >
                {title}
              </Text>
            </View>
          </PromptOnTap>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestion: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderCurve: "continuous",
    padding: 8,
    borderColor: AC.systemGray5,
    backgroundColor: AC.secondarySystemGroupedBackground,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
