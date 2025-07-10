"use client";

import type React from "react";
import { useState, useRef } from "react";

import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

type ActiveButton = "none" | "add";
type MessageType = "user" | "system";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  completed?: boolean;
  file?: File;
  citations?: {
    text: string;
    source: string;
    link: string;
  }[];
}

export default function ChatInterface2() {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasTyped, setHasTyped] = useState(false);
  const [activeButton, setActiveButton] = useState<ActiveButton>("none");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const getAIResponse = (userMessage: string) => {
    return {
      answer: "Yes, under Section 166 of the Motor Vehicles Act, 1988...",
      citations: [
        {
          text: "As the age of the deceased at the time of accident was held to be about 54–55 years...",
          source: "Dani_Devi_v_Pritam_Singh.pdf",
          link: "https://lexisingapore-my.sharepoint.com/:b:/g/personal/harshit_lexi_sg/EdOegeiR_gdBvQxdyW4xE6oBCDgj5E4Bo5wjvhPHpqgIuQ?e=TEu4vz",
        },
      ],
    };
  };

  const simulateAIResponse = async (userMessage: string) => {
    const { answer, citations } = getAIResponse(userMessage);
    const messageId = Date.now().toString();
    setIsStreaming(true);
    // 1. Add empty system message with completed: false
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        content: "",
        type: "system",
        completed: false,
        citations,
      },
    ]);
    // 2. Wait 1.5 seconds to simulate loading
    setTimeout(() => {
      // 3. Replace the message with actual response and completed: true
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: answer, completed: true, citations }
            : msg
        )
      );

      setIsStreaming(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!isStreaming) {
      setInputValue(newValue);
      if (newValue.trim() !== "" && !hasTyped) {
        setHasTyped(true);
      } else if (newValue.trim() === "" && hasTyped) {
        setHasTyped(false);
      }
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 160));
        textarea.style.height = `${newHeight}px`;
      }
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      const userMessage = inputValue.trim();
      const newUserMessage = {
        id: `user-${Date.now()}`,
        content: userMessage,
        type: "user" as MessageType,
        file: selectedFile ?? undefined,
      };
      setInputValue("");
      setHasTyped(false);
      setSelectedFile(null);
      setActiveButton("none");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      // Add the message after resetting input
      setMessages((prev) => [...prev, newUserMessage]);
      // Focus textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      // Start AI response
      simulateAIResponse(userMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Cmd+Enter
    if (!isStreaming && e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      handleSubmit(e);
      return;
    }
    // Handle Enter (without Shift)
    if (!isStreaming && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleButton = (button: ActiveButton) => {
    if (!isStreaming) {
      setActiveButton((prev) => (prev === button ? "none" : button));
    }
  };

  return (
    <>
      <ChatHeader />
      <div className="flex-grow pb-32 pt-12 px-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput
        inputValue={inputValue}
        isStreaming={isStreaming}
        hasTyped={hasTyped}
        textareaRef={textareaRef}
        inputContainerRef={inputContainerRef}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleSubmit={handleSubmit}
        activeButton={activeButton}
        toggleButton={toggleButton}
        handleFileUpload={handleFileUpload}
        selectedFile={selectedFile}
        clearSelectedFile={clearSelectedFile}
      />
    </>
  );
}
