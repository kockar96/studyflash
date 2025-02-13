import { atom } from "jotai";
import { Message } from "./components/prompt-on-tap";

export const messagesAtom = atom<Message[]>([]);
