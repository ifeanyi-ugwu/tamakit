"use client";

import { useState } from "react";
import { LiveProvider, LivePreview, LiveEditor, LiveError } from "react-live";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Stack, Text, YStack, XStack } from "tamagui";

const scope = {
  Button,
  Card,
  Input,
  Stack,
  YStack,
  XStack,
  Text,
};

export function ComponentPreview({ code }: { code: string }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="bg-background p-6">
        <LiveProvider code={code} scope={scope} noInline={false}>
          <LivePreview />
          <LiveError className="mt-2 rounded bg-destructive/10 p-2 text-xs text-destructive" />
        </LiveProvider>
      </div>

      <div className="flex items-center justify-end border-t border-border bg-muted/40 px-4 py-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {showCode ? "Hide code" : "Show code"}
        </button>
      </div>

      {showCode && (
        <LiveProvider code={code} scope={scope} noInline={false}>
          <LiveEditor className="border-t border-border bg-muted p-4 font-mono text-sm" />
        </LiveProvider>
      )}
    </div>
  );
}
