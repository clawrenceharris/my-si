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
import { chatMessageSchema, type ChatFormData } from "../domain/chat.schema";

interface ChatInputProps {
  placeholder?: string;
  onSubmit?: (data: ChatFormData) => void;
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
      defaultValues={{ mode: "in_person", topic: "" }}
      onSubmit={onSubmit}
      isLoading={isLoading || loading}
      disabled={disabled}
      submitText="Create Lesson Plan"
      submitButtonClassName="bg-gradient-to-r from-secondary-400 to-secondary-600 hover:from-secondary-400/90 hover:to-secondary-600/90 rounded-full text-white border-0  hover:shadow-lg hover:scale-[1.02] transition-all  duration-200"
      showsCancelButton={false}
    >
      {({ control, formState: { errors } }) => (
        <FormField
          control={control}
          defaultValue=""
          name="topic"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="sr-only">Chat message</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={placeholder}
                  disabled={disabled || isLoading || loading}
                />
              </FormControl>
              {errors.topic && (
                <FormMessage>{errors.topic.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      )}
    </FormLayout>
  );
}
