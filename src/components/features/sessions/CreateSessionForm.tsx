import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import { CreateSessionInput } from "@/features/sessions/domain";
import { useFormContext } from "react-hook-form";

export function CreateSessionForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateSessionInput>();

  return (
    <>
      <FormField
        name="topic"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Topic</FormLabel>
            <FormControl>
              <Textarea placeholder="Topic" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="description"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div>
        <FormField
          name="startDate"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="startTime"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Chat message</FormLabel>
              <FormControl>
                <Input {...field} type="time" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormMessage>
          {errors.startDate?.message || errors.startTime?.message}
        </FormMessage>
      </div>
    </>
  );
}
