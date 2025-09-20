"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormLayout } from "@/components/forms/FormLayout";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ChatFormData, chatMessageSchema } from "@/features/chat";

interface ChatInputProps {
  placeholder?: string;
  onSubmit?: (data: ChatFormData) => Promise<void | null> | void;
  disabled?: boolean;
  isLoading?: boolean;
  loading?: boolean;
}

export function ChatInput({
  placeholder = "What topic would you like to create a lesson for?",
  onSubmit,
  disabled = false,
  isLoading = false,
  loading = false,
}: ChatInputProps) {
  return (
    <FormLayout<ChatFormData>
      resolver={zodResolver(chatMessageSchema)}
      defaultValues={{ mode: "in_person" }}
      onSubmit={onSubmit}
      isLoading={isLoading || loading}
      disabled={disabled}
      submitText="Create Lesson Plan"
      submitButtonClassName="bg-gradient-to-r from-primary-400 to-secondary-500 hover:from-primary-400/90 hover:to-secondary-500/90 text-white border-0 shadow-md hover:shadow-xl transition-all duration-200"
      showsCancelButton={false}
    >
      <FormField
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Chat message</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder={placeholder}
                disabled={disabled || isLoading || loading}
                aria-label="Chat message input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormLayout>
  );
}
