"use client";

import React from "react";
import { FormField, FormItem, FormMessage } from "@/components/ui";

import { useFormContext } from "react-hook-form";
import { useStrategies } from "@/features/strategies/hooks";
import { EmptyState, LoadingState } from "@/components/states";
import { Label } from "@/components/ui";
import { StrategySearchField, StrategyCard } from "./";
import { Strategies } from "@/types/tables";

export default function StrategySelectionForm() {
  const { strategies, isLoading } = useStrategies();

  const { control, watch } = useFormContext<{ strategy: Strategies }>();
  const selectedStrategy = watch("strategy");

  if (isLoading) {
    return <LoadingState variant="container" />;
  }
  if (!strategies) {
    return <EmptyState />;
  }
  return (
    <>
      <FormField
        name="strategy"
        control={control}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <Label htmlFor="strategy">Choose any Strategy</Label>
            <StrategySearchField
              id="strategy"
              name="strategy"
              onStrategySelect={(s) => {
                field.onChange(s);
              }}
              selectedStrategy={selectedStrategy}
            />

            {selectedStrategy && (
              <StrategyCard strategy={selectedStrategy} selected />
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
