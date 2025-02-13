"use client";
import * as AC from "@bacons/apple-colors";
import React from "react";
import { Text, View } from "react-native";

type Props = { children?: React.ReactNode; turn: "user" | "llm" };

export function ChatMessage({ children, turn }: Props) {
  const isLLM = turn === "llm";
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: isLLM ? "flex-start" : "flex-end",
        flexDirection: "row",
        maxWidth: "100%",
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 8,
          justifyContent: isLLM ? "flex-start" : "flex-end",
        }}
      >
        {isLLM && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "purple",
            }}
          />
        )}
        <Text
          numberOfLines={100}
          style={{
            borderCurve: "continuous",
            backgroundColor: isLLM ? "gray" : "white",
            borderWidth: 1,
            borderColor: AC.separator,
            borderRadius: 20,
            borderBottomRightRadius: !isLLM ? 8 : undefined,
            borderBottomLeftRadius: isLLM ? 8 : undefined,
            flexWrap: "wrap",
            wordWrap: "break-word",
            textAlign: isLLM ? "left" : "right",
            color: "black",
            padding: 12,
            fontSize: 16,
            maxWidth: "80%",
          }}
          selectable
        >
          {children}
        </Text>
      </View>
    </View>
  );
}
