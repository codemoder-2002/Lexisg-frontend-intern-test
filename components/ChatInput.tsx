"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Lightbulb, ArrowUp } from "lucide-react";
import type { RefObject } from "react";
import { useRef, useState } from "react";

type Props = {
  inputValue: string;
  isStreaming: boolean;
  hasTyped: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  inputContainerRef: RefObject<HTMLDivElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  activeButton: "none" | "add";
  toggleButton: (button: "none" | "add") => void;
  handleFileUpload: (file: File) => void;
  selectedFile: File | null;
  clearSelectedFile: () => void;
};

export default function ChatInput({
  inputValue,
  isStreaming,
  hasTyped,
  textareaRef,
  inputContainerRef,
  handleInputChange,
  handleKeyDown,
  handleSubmit,
  activeButton,
  toggleButton,
  handleFileUpload,
  selectedFile,
  clearSelectedFile,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
      e.target.value = ""; // reset so same file can be selected again
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
      e.target.value = ""; // reset so same file can be selected again
    }
  };

  const openFileInput = () => {
    setShowUploadOptions(false);
    fileInputRef.current?.click();
  };

  const openImageInput = () => {
    setShowUploadOptions(false);
    imageInputRef.current?.click();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
      <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-0" />
      <form
        onSubmit={(e) => {
          // UI-only: preview that file is included in message
          handleSubmit(e);
        }}
        className="max-w-3xl mx-auto bg-white "
      >
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div
          ref={inputContainerRef}
          className={cn(
            "relative w-full rounded-3xl border border-gray-200 bg-neutral-100 p-3 cursor-text",
            isStreaming && "opacity-80"
          )}
          onClick={() => {
            if (textareaRef?.current) textareaRef.current.focus();
          }}
        >
          {/* File/Image Preview UI - moved outside .pb-9 and above Textarea */}
          {selectedFile && (
            <div className="absolute -top-20 left-3 right-3 bg-gray-100 p-2 rounded-md flex items-center gap-2">
              <div className="flex-grow">
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="preview"
                    className="h-16 rounded"
                  />
                ) : selectedFile.type === "application/pdf" ? (
                  <span className="text-sm text-gray-600">
                    📄 {selectedFile.name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">
                    📎 {selectedFile.name}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => clearSelectedFile()}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ❌
              </button>
            </div>
          )}
          <div className="pb-9">
            <Textarea
              ref={textareaRef}
              placeholder={
                isStreaming ? "Waiting for response..." : "Ask Anything"
              }
              className="min-h-[24px] max-h-[160px] w-full rounded-3xl border-0 bg-transparent text-gray-900 placeholder:text-gray-400 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 relative">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full h-8 w-8 flex-shrink-0 border-gray-200 p-0 transition-colors",
                      activeButton === "add" && "bg-gray-100 border-gray-300"
                    )}
                    onClick={() => {
                      toggleButton("add");
                      setShowUploadOptions(!showUploadOptions);
                    }}
                    disabled={isStreaming}
                  >
                    <Plus
                      className={cn(
                        "h-4 w-4 text-gray-500",
                        activeButton === "add" && "text-gray-700"
                      )}
                    />
                    <span className="sr-only">Add</span>
                  </Button>
                  {showUploadOptions && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max rounded-md border border-gray-300 bg-white shadow-lg z-10 flex flex-col">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 text-gray-700 rounded-t-md"
                        onClick={openFileInput}
                      >
                        📎 File
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 text-gray-700 rounded-b-md"
                        onClick={openImageInput}
                      >
                        🖼️ Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full h-8 w-8 border-0 flex-shrink-0 transition-all duration-200",
                  hasTyped ? "bg-black scale-110" : "bg-gray-200"
                )}
                disabled={!inputValue.trim() || isStreaming}
              >
                <ArrowUp
                  className={cn(
                    "h-4 w-4 transition-colors",
                    hasTyped ? "text-white" : "text-gray-500"
                  )}
                />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
