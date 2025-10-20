"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

type AIInput = {
  query: string;
};

type AIOutputput = {
  rows: string[];
};

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                SQL Agent
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ask questions about your PostgreSQL database
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto px-6 pb-32 pt-8">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💾</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to SQL Agent
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              I can help you query your database using natural language. Just
              ask me anything about your products and sales data!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Sales Analytics
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  "Show me top selling products"
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-2xl mb-2">🏪</div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Inventory
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  "Which products are low in stock?"
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-2xl mb-2">🌍</div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Regional Data
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  "Sales by region last month"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-4"
            >
              <div className="flex items-center mb-3">
                {message.role === "user" ? (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">�</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                )}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {message.role === "user" ? "You" : "SQL Agent"}
                </span>
              </div>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="prose dark:prose-invert max-w-none"
                      >
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {part.text}
                        </div>
                      </div>
                    );

                  case "tool-db":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="my-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                      >
                        <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                          🔍 Database Query
                        </div>

                        {(part.input as unknown as AIInput)?.query && (
                          <pre className="text-xs bg-white dark:bg-zinc-900 p-2 rounded mb-2 overflow-x-auto">
                            {(part.input as unknown as AIInput).query}
                          </pre>
                        )}
                        {part.state === "output-available" &&
                          (part.output as unknown as AIOutputput) && (
                            <div className="text-sm text-green-700 dark:text-green-300">
                              ✅ Returned{" "}
                              {(part.output as unknown as AIOutputput).rows
                                ?.length || 0}{" "}
                              rows
                            </div>
                          )}
                      </div>
                    );

                  case "tool-schema":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="my-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
                      >
                        <div className="font-semibold text-purple-700 dark:text-purple-300">
                          📋 Schema Tool
                        </div>
                        {part.state === "output-available" && (
                          <div className="text-sm text-green-700 dark:text-green-300 py-2">
                            ✅ Schema loaded
                          </div>
                        )}
                      </div>
                    );

                  case "step-start":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="text-sm text-gray-500 dark:text-gray-400 my-4"
                      >
                        🔄 Processing...
                      </div>
                    );

                  case "reasoning":
                    // Optional: show reasoning
                    return null;

                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Input Form */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              sendMessage({ text: input });
              setInput("");
            }}
            className="flex space-x-4"
          >
            <input
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={input}
              placeholder="Ask about your database... (e.g., 'Show me the top selling products')"
              onChange={(e) => setInput(e.currentTarget.value)}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
