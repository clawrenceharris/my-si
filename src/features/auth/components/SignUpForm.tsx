import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { SignUpFormInput } from "../domain/auth.types";

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

export default function SignUpForm({ onSwitchToLogin }: SignupFormProps) {
  const {
    control,
    formState: { errors, disabled },
  } = useFormContext<SignUpFormInput>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* First Name */}
      <div className="flex flex-row gap-3">
        <FormField
          control={control}
          name="firstName"
          defaultValue=""
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="First name" {...field} />
              </FormControl>
              {errors.firstName && (
                <FormMessage>{errors.firstName.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        {/* Last Name */}
        <FormField
          control={control}
          name="lastName"
          defaultValue=""
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Last name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {(errors.lastName || errors.firstName) && (
          <FormMessage>
            {errors.firstName?.message || errors.lastName?.message}
          </FormMessage>
        )}
      </div>
      {/* Email */}
      <FormField
        control={control}
        name="email"
        defaultValue=""
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Email Address</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Email" {...field} />
            </FormControl>
            {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={control}
        name="password"
        defaultValue=""
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Password</FormLabel>
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...field}
              />
            </FormControl>
            <Button
              type="button"
              variant={"default"}
              size={"icon"}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute-center  flex  text-gray-400 hover:text-gray-600 left-[95%]"
              disabled={disabled}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
            {errors.password && (
              <FormMessage>{errors.password.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      {/* Switch to login */}
      {onSwitchToLogin && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant={"link"}
              onClick={onSwitchToLogin}
              className="btn font-medium text-primary hover:text-red-700"
              disabled={disabled}
            >
              Sign in
            </Button>
          </p>
        </div>
      )}
    </>
  );
}
