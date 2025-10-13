import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Strategies } from "@/types/tables";

interface StrategyCardProps {
  strategy: Strategies;
  onClick?: () => void;
  selected: boolean;
  showsSteps?: boolean;
}

export default function StrategyCard({
  onClick,
  strategy,
  selected,
  showsSteps = true,
}: StrategyCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`strategy-card flex-1 p-0 relative rounded-2xl border border-border shadow-md bg-card text-card-foreground transition-transform. ${
        selected ? "border-primary-400 border-1" : ""
      }`}
    >
      <CardHeader className="flex relative text-foreground items-center p-3 gap-6 rounded-tl-2xl rounded-tr-2xl">
        <CardTitle>{strategy.title}</CardTitle>
      </CardHeader>
      {showsSteps && (
        <CardContent className="p-6">
          <ol className="text-foreground/80 space-y-4">
            {strategy.steps.map((s: string, i: number) => (
              <li className="flex items-center gap-3 " key={i}>
                <div className="bg-primary-100 text-primary-400 text-pr min-w-7 min-h-7  rounded-full items-center justify-center flex">
                  <span>{i + 1}</span>
                </div>

                <p className=" max-w-sm">{s}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      )}
    </Card>
  );
}
