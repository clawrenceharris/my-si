import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Switch,
  Textarea,
} from "@/components/ui";
import { CreateSessionInput } from "@/features/sessions/domain";
import { Controller, useFormContext } from "react-hook-form";

export function CreateSessionForm() {
  const {
    control,
    watch,

    formState: { errors },
  } = useFormContext<CreateSessionInput>();

  const watched = watch("virtual");
  console.log(watched);
  return (
    <>
      <FormField
        name="course_name"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Course name</FormLabel>
            <FormControl>
              <Input placeholder="Course" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="topic"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Topic</FormLabel>
            <FormControl>
              <Input placeholder="Topic" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      {errors.topic && <FormMessage>{errors.topic.message}</FormMessage>}
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
      {errors.description && (
        <FormMessage>{errors.description.message}</FormMessage>
      )}
      <div className="flex gap-4">
        <FormField
          name="start_date"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="start_time"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start time</FormLabel>
              <FormControl>
                <Input {...field} type="time" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      {(errors.start_date || errors.start_time) && (
        <FormMessage>
          {errors.start_date?.message || errors.start_time?.message}
        </FormMessage>
      )}

      <Label htmlFor="virtual">Virtual:</Label>
      <Controller
        name="virtual"
        control={control}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            id="virtual"
          />
        )}
      />

      {errors.virtual && <FormMessage>{errors.virtual.message}</FormMessage>}
    </>
  );
}
