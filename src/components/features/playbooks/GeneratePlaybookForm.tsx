"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormLayout, FormLayoutProps } from "@/components/layouts/FormLayout";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label, Switch, Toggle } from "@/components/ui";
import { useSupabaseClient } from "@/providers";
import { StudentContexts } from "@/types/tables";
import {
  GeneratePlaybookInput,
  generatePlaybookSchema,
} from "@/features/playbooks/domain";

export function GeneratePlaybookForm({
  ...props
}: FormLayoutProps<GeneratePlaybookInput>) {
  const client = useSupabaseClient();
  const [contexts, setContexts] = useState<StudentContexts[]>([]);

  useEffect(() => {
    const fetchContexts = async () => {
      const { data, error } = await client.from("student_contexts").select();
      if (!error) setContexts(data || []);
    };
    fetchContexts();
  }, [client]);
  return (
    <FormLayout<GeneratePlaybookInput>
      resolver={zodResolver(generatePlaybookSchema)}
      defaultValues={{
        course_name: "",
        topic: "",
        virtual: false,
        contexts: [],
      }}
      enableBeforeUnloadProtection={false}
      submitText="Create Playbook"
      submitButtonClassName="bg-gradient-to-r from-primary-400 to-secondary-500 hover:from-primary-400/90 hover:to-secondary-500/90 text-white border-0 shadow-md hover:shadow-xl transition-all duration-200"
      showsCancelButton={false}
      {...props}
    >
      {({ control }) => (
        <>
          <FormField
            name="course_name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="What course is this Playbook for?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="topic"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="What topic will you be covering?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contexts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Context Tags</FormLabel>
                <div className="flex gap-4 flex-wrap">
                  {contexts.map((ctx) => (
                    <Toggle
                      variant={"outline"}
                      key={ctx.id}
                      size={"lg"}
                      pressed={field.value?.includes(ctx.context)}
                      onPressedChange={(pressed) => {
                        if (pressed) {
                          console.log(field.value);

                          field.onChange([...field.value, ctx.context]);
                        } else {
                          field.onChange(
                            field.value.filter((c: string) => c !== ctx.context)
                          );
                        }
                      }}
                    >
                      {ctx.context}
                    </Toggle>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="virtual"
            control={control}
            render={({ field }) => (
              <Label htmlFor="virtual">
                Virtual:
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="virtual"
                />
              </Label>
            )}
          />
        </>
      )}
    </FormLayout>
  );
}
