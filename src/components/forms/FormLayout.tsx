"use client";
import { useEffect, type ReactNode } from "react";
import {
  useForm,
  type UseFormProps,
  type FieldValues,
  type DefaultValues,
  type UseFormReturn,
  Resolver,
} from "react-hook-form";
import { Form, FormDescription, FormMessage } from "../ui/form";
import { getUserErrorMessage } from "@/shared";
import { Button } from "../ui";
import { Loader2 } from "lucide-react";

export interface FormLayoutProps<T extends FieldValues>
  extends UseFormProps<T> {
  children?: ((methods: UseFormReturn<T>) => ReactNode) | ReactNode;
  showsSubmitButton?: boolean;
  showsCancelButton?: boolean;
  submitText?: string;
  cancelText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: T) => void | Promise<any>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  isOpen?: boolean;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver: Resolver<T, any, T>;
  descriptionStyle?: React.CSSProperties;
  defaultValues?: DefaultValues<T>;
  enableBeforeUnloadProtection?: boolean;
  submitButtonClassName?: string;
}

export function FormLayout<T extends FieldValues>({
  children,
  showsSubmitButton = true,
  showsCancelButton = true,
  submitText = "Done",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  resolver,
  submitButtonClassName,
  isLoading = false,
  mode = "onSubmit",
  isOpen = true,
  description,
  descriptionStyle,
  enableBeforeUnloadProtection = true,
  ...formProps
}: FormLayoutProps<T>) {
  const form = useForm<T>({
    ...formProps,
    resolver,
    mode,
  });

  useEffect(() => {
    if (!enableBeforeUnloadProtection || !isOpen) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enableBeforeUnloadProtection, isOpen, form.formState.isDirty]);

  const handleSubmit = async (data: T) => {
    try {
      console.log("submitting");
      await onSubmit?.(data);
    } catch (error) {
      console.error(error);
      form.setError("root", { message: getUserErrorMessage(error) });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {description && (
          <FormDescription style={descriptionStyle}>
            {description}
          </FormDescription>
        )}

        <div className="space-y-6">
          {/* General Error */}
          {form.formState.errors.root && (
            <div className="p-3 text-sm text-red-600 bg-red-500/20 border border-red-500 rounded-md">
              <FormMessage>{form.formState.errors.root.message} </FormMessage>
            </div>
          )}
          {typeof children === "function" ? children(form) : children}
        </div>

        <div className="justify-end flex items-center">
          {showsCancelButton && (
            <Button
              variant={"ghost"}
              type="button"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}

          {showsSubmitButton && (
            <Button type="submit" className={submitButtonClassName} size={"lg"}>
              {isLoading ? <Loader2 className="animate-spin" /> : submitText}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
