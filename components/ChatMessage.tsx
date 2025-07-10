"use client";

import { cn } from "@/lib/utils";
import { RefreshCcw, Copy, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Message } from "./chat-interface2";
import FileAttachment from "./file-attachment";
import { Skeleton } from "./ui/skeleton";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        "flex flex-col",
        message.type === "user" ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1 ">
        {message.file && (
          <div className="mt-2">
            {message.file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(message.file)}
                alt="attachment"
                className="max-h-48 rounded-md"
              />
            ) : (
              <FileAttachment file={message.file} />
            )}
          </div>
        )}
      </div>
      <div
        className={cn(
          "max-w-none px-4 py-2 rounded-2xl",
          message.type === "user"
            ? "bg-white border border-gray-200 rounded-br-none"
            : "text-gray-900"
        )}
      >
        {message.completed !== false ? (
          message.type === "system" ? (
            <div className="space-y-4 text-sm leading-relaxed text-gray-900">
              <p>{message.content}</p>
              {(message.citations?.length ?? 0) > 0 && (
                <div className="mt-4 space-y-2 ">
                  {message.citations?.map((citation, index) => (
                    <div key={index} className="p-3 ">
                      <blockquote className="italic text-gray-700 mb-2">
                        “{citation.text}”
                      </blockquote>
                      <a
                        href={citation.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        📄 {citation.source}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap">
              {message.content}
            </p>
          )
        ) : (
          <span className="text-gray-500">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </span>
        )}
      </div>

      {message.type === "system" && message.completed && (
        <div className="flex items-center gap-2 px-4 mt-1 mb-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Copy className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
