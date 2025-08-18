import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sun, Moon } from "lucide-react";
import { io } from "socket.io-client";

// ...existing code...
export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [soket, setSoket] = useState(null)
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // apply theme to html element so global css or tailwind dark classes can work
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    soket.emit("ai-message", inputValue)

    setInputValue("");
    setIsTyping(true);
    // Simulate bot response
    
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(()=>{
    let socketInstance = io("https://ai-chatbot-kws6.onrender.com");
    setSoket(socketInstance)
    socketInstance.on("ai-message-response", (response)=>{
      setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
    })
  },[])

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-b border-gray-700"
            : "bg-white border-b border-gray-200"
        } shadow-lg`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${
                  theme === "dark" ? "bg-indigo-600" : "bg-indigo-500"
                } rounded-full flex items-center justify-center`}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Chat Assistant
                </h1>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Online
                </p>
              </div>
            </div>

            {/* Theme toggle */}
            <div>
              <button
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                className={`p-2 rounded-md transition-colors duration-150 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                aria-label="Toggle theme"
                title="Toggle light / dark"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl flex items-start space-x-3 ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-indigo-500"
                    : theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-400"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-indigo-500 text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-100 shadow-md border border-gray-700"
                    : "bg-white text-gray-800 shadow-md border border-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-indigo-200"
                      : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl flex items-start space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-400"
                }`}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-100 border border-gray-700"
                    : "bg-white text-gray-800 shadow-md border border-gray-100"
                } rounded-2xl px-4 py-3`}
              >
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: theme === "dark" ? "#9CA3AF" : "#9CA3AF",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      animationDelay: "0.1s",
                      backgroundColor: theme === "dark" ? "#9CA3AF" : "#9CA3AF",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      animationDelay: "0.2s",
                      backgroundColor: theme === "dark" ? "#9CA3AF" : "#9CA3AF",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-t border-gray-700"
            : "bg-white border-t border-gray-500"
        } px-4 py-4`}
      >
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={`w-full resize-none border rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 max-h-32 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-transparent"
              }`}
              rows="1"
              style={{
                minHeight: "44px",
                height: "auto",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={inputValue.trim() === ""}
            className={`rounded-full p-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
              inputValue.trim() === ""
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
// ...existing code...
