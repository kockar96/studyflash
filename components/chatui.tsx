"use client";

import React from "react";
import { Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack } from "expo-router";
import { ChatToolbarInner } from "./chat-toolbar";
import { KeyboardFriendlyScrollView } from "./keyboard-friendly-scrollview";
import { HeaderButton } from "./ui/Header";
import { IconSymbol } from "./ui/IconSymbol";

import * as AC from "@bacons/apple-colors";

import { messagesAtom } from "@/atoms";
import { nanoid } from "@/util/nanoid";
import { tw } from "@/util/tw";
import { useAtom } from "jotai";
import { AnimatedLogo } from "./animated-logo";
import { ChatContainer } from "./chat-container";
import { UserMessage } from "./user-message";

const HEADER_HEIGHT = 0;

function MessagesScrollView() {
  const [messages] = useAtom(messagesAtom);

  const { top } = useSafeAreaInsets();

  const textInputHeight = 8 + 36;

  return (
    <>
      <KeyboardFriendlyScrollView
        style={[{ flex: 1 }, tw`md:w-[768px] max-w-[768px] md:mx-auto`]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top + HEADER_HEIGHT + 24,
          paddingBottom: textInputHeight,
          gap: 16,
          flex: messages.length ? undefined : 1,
        }}
      >
        {
          // View messages in UI state
          messages.map((message) => (
            <View key={message.id}>{message.display}</View>
          ))
        }
      </KeyboardFriendlyScrollView>
      {messages.length === 0 && <AnimatedLogo />}
    </>
  );
}

export function ChatUI() {
  const [messages, setMessages] = useAtom(messagesAtom);

  return (
    <ChatContainer>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              {!!messages.length && (
                <HeaderButton
                  pressOpacity={0.7}
                  style={[
                    process.env.EXPO_OS === "web"
                      ? {
                          paddingHorizontal: 16,
                          alignItems: "center",
                          display: "flex",
                        }
                      : {
                          // Offset on the side so the margins line up. Unclear how to handle when this is used in headerLeft.
                          // We should automatically detect it somehow.
                          marginRight: -8,
                        },
                  ]}
                  onPress={() => {
                    setMessages([]);
                  }}
                >
                  <IconSymbol name="square.and.pencil" color={AC.label} />
                </HeaderButton>
              )}
            </>
          ),
        }}
      />

      <MessagesScrollView />

      <ChatToolbar />
    </ChatContainer>
  );
}

const AI_MESSAGES = [
  "Hello, how can I assist you today?",
  "Feel free to ask me anything.",
  "What can I do for you?",
  "I'm here to provide support.",
  "How can I be of service?",
  "Let me know if you need any help.",
  "What would you like to know?",
  "I'm here to answer your questions.",
  "How can I assist you?",
  "Is there something you need help with?",
  "I'm here to help you out.",
  "What can I help you with today?",
  "Feel free to ask for assistance.",
  "I'm here to support you.",
  "What do you need help with?",
];

function ChatToolbar() {
  const [messages, setMessages] = useAtom(messagesAtom);
  const onSubmit = (message: string) => {
    return {
      id: nanoid(),
      display: (
        <UserMessage>
          {AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)]}
        </UserMessage>
      ),
    };
  };

  return (
    <ChatToolbarInner
      messages={messages}
      setMessages={setMessages}
      onSubmit={onSubmit}
    />
  );
}
