"use client";

import { ReactNode, useCallback, useState } from "react";
import { TouchableOpacityProps } from "react-native";
import TouchableBounce from "./ui/TouchableBounce";
import { UserMessage } from "./user-message";

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

function usePromptOnPress(prompt: string | [string, string]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [response, setResponse] = useState<string | undefined>(undefined);
  const onSubmit = () => {
    setResponse("Hi! Great to see you here!");
  };

  return useCallback(async () => {
    const [displayPrompt, detailedPrompt] = Array.isArray(prompt)
      ? prompt
      : [prompt, prompt];
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <UserMessage>{displayPrompt}</UserMessage>,
      },
    ]);

    setMessages((currentMessages: any[]) => [...currentMessages, response]);
  }, [setMessages, onSubmit, prompt]);
}
