"use client";

import { messagesAtom } from "@/atoms";
import { nanoid } from "@/util/nanoid";
import { useAtom } from "jotai";
import { ReactNode, useCallback } from "react";
import { TouchableOpacityProps } from "react-native";
import TouchableBounce from "./ui/TouchableBounce";
import { ChatMessage } from "./user-message";

export function PromptOnTap({
  prompt,
  onPress,
  ...props
}: { prompt: string | [string, string] } & TouchableOpacityProps) {
  const onPressPrompt = usePromptOnPress(prompt);
  return (
    <TouchableBounce
      {...props}
      sensory
      onPress={async (e) => {
        onPress?.(e);
        onPressPrompt();
      }}
    />
  );
}

export type Message = {
  id: string;
  display: ReactNode;
};

const LLM_RESPONSES =
  "LLM is going to respond to this prompt with some content.";

function usePromptOnPress(prompt: string | [string, string]) {
  const [messages, setMessages] = useAtom(messagesAtom);

  return useCallback(async () => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <ChatMessage turn="user">{prompt}</ChatMessage>,
      },
    ]);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <ChatMessage turn="llm">{LLM_RESPONSES}</ChatMessage>,
      },
    ]);
  }, [setMessages, prompt]);
}
