"use client";

import InputField from "@/components/share/form/InputField";
import { Button } from "@/components/ui/button";
import useSocket from "@/hooks/ usesocket";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const Chat = () => {
  const form = useForm({
    defaultValues: { message: "" },
  });

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    // Listen for all previous messages once
    socket.on("previous messages", (msgs) => {
      setMessages(msgs);
    });

    // Listen for new chat messages from server
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
      socket.off("previous messages");
    };
  }, [socket]);

  const sendMessage = (data) => {
    const messagePayload = {
      message: data.message,
    };

    if (socket && messagePayload.message.trim()) {
      socket.emit("chat message", messagePayload);
      form.reset(); // Clear input field
    }
  };

  return (
    <div>
      <div className="flex flex-col max-h-96 overflow-y-auto bg-gray-100 p-4">
        {messages.map((msg, index) => (
          <div key={index}>
            <div>
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.text?.name && (
                  <span className="font-medium">– {msg.text.name}</span>
                )}
              </div>
              <div className="whitespace-pre-wrap break-words">
                {msg.text?.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(sendMessage)}
          className="space-y-6 mt-3"
        >
          <InputField
            form={form}
            name="message"
            label="Message"
            placeholder="Type your message..."
            type="text"
          />
          <Button
            type="submit"
            disabled={loading}
            className="primary-color text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Chat;
