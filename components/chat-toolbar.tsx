"use client";

import { nanoid } from "@/util/nanoid";
import { tw } from "@/util/tw";
import * as AC from "@bacons/apple-colors";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FirstSuggestions } from "./first-suggestions";
import { IconSymbol } from "./ui/IconSymbol";
import TouchableBounce from "./ui/TouchableBounce";
import { ChatMessage } from "./user-message";
import { Message } from "./prompt-on-tap";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface ChatToolbarInnerProps {
  messages: Message[];
  setMessages: (v: Message[]) => void;
  onSubmit: (message: string) => string;
  disabled?: boolean;
}

export function ChatToolbarInner({
  messages,
  setMessages,
  onSubmit,
  disabled = false,
}: ChatToolbarInnerProps) {
  const [inputValue, setInputValue] = useState("");
  const textInput = useRef<TextInput>(null);
  const { bottom } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  const translateStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -keyboard.height.value }],
    }),
    [bottom]
  );

  const blurStyle = useAnimatedStyle(() => {
    const assumedKeyboardHeight = 100;
    const inverse = Math.max(
      0,
      Math.min(
        1,
        (assumedKeyboardHeight - keyboard.height.value) / assumedKeyboardHeight
      )
    );

    return {
      paddingBottom: 8 + bottom * inverse,
    };
  }, [bottom]);

  const onSubmitMessage = useCallback(
    (value: string) => {
      if (value.trim() === "") {
        textInput.current?.blur();
        return;
      }

      if (process.env.EXPO_OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      setTimeout(() => {
        textInput.current?.clear();
      });

      const response = onSubmit(value);
      const llmMessage = {
        id: nanoid(),
        display: <ChatMessage turn="llm">{response}</ChatMessage>,
      };

      setMessages([
        // Should be  in two steps, but as it's sync, no need, if it were async, we would set first the user message, then the llm message once it's ready so  the UI would not be blocked
        ...messages,
        {
          id: nanoid(),
          display: <ChatMessage turn={"user"}>{value}</ChatMessage>,
        },

        llmMessage,
      ]);

      setInputValue("");
    },
    [textInput, setMessages, onSubmit, messages]
  );

  const onSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmitMessage(e.nativeEvent.text);
    },
    [onSubmitMessage]
  );

  const theme = useColorScheme();

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
          gap: 8,
          pointerEvents: "box-none",
        },
        translateStyle,
      ]}
    >
      <View style={tw`md:w-[768px] max-w-[768px] md:mx-auto`}>
        {!disabled && messages.length === 0 && <FirstSuggestions />}
      </View>

      <AnimatedBlurView
        tint={
          theme === "light"
            ? "systemChromeMaterial"
            : "systemChromeMaterialDark"
        }
        style={[
          {
            paddingTop: 8,
            paddingBottom: 8,
            paddingHorizontal: 16,
            alignItems: "stretch",
          },
          blurStyle,
        ]}
      >
        <View
          style={[
            {
              flexDirection: "row",
              gap: 8,

              alignItems: "stretch",
            },
            tw`md:w-[768px] max-w-[768px] md:mx-auto`,
          ]}
        >
          <TextInput
            ref={textInput}
            onChangeText={setInputValue}
            keyboardAppearance={theme ?? "light"}
            cursorColor={AC.label}
            returnKeyType="send"
            blurOnSubmit={false}
            selectionHandleColor={AC.label}
            selectionColor={AC.label}
            style={{
              pointerEvents: disabled ? "none" : "auto",
              color: AC.label,
              padding: 16,
              borderColor: AC.separator,
              backgroundColor: AC.secondarySystemGroupedBackground,
              borderWidth: 1,
              borderRadius: 999,
              paddingVertical: 8,
              fontSize: 16,
              outline: "none",
              flex: 1,
              marginBottom: 16,
            }}
            placeholder="Ask anything"
            autoCapitalize="sentences"
            autoCorrect
            placeholderTextColor={AC.systemGray2}
            onSubmitEditing={onSubmitEditing}
          />

          <SendButton
            enabled={!!inputValue.length}
            onPress={() => onSubmitMessage(inputValue)}
          />
        </View>
      </AnimatedBlurView>
    </Animated.View>
  );
}

function SendButton({
  enabled,
  onPress,
}: {
  enabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableBounce
      disabled={!enabled}
      sensory
      // @ts-expect-error
      style={
        process.env.EXPO_OS === "web"
          ? {
              display: "grid",
              marginRight: 8,
            }
          : {}
      }
      onPress={onPress}
    >
      <View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderColor: AC.separator,
            borderWidth: 1,
            aspectRatio: 1,
            backgroundColor: AC.label,
            borderRadius: 999,
          },
          !enabled && { opacity: 0.5 },
          tw`transition-transform hover:scale-95`,
        ]}
      >
        <IconSymbol name="arrow.up" size={20} color={AC.systemBackground} />
      </View>
    </TouchableBounce>
  );
}
