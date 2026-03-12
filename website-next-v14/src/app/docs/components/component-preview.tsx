import { useState } from "react";
import { LiveProvider, LivePreview, LiveEditor, LiveError } from "react-live";
import { Button } from "@/components/ui/button"; //"registry/button/a";

import { Stack, Text } from "tamagui";

const scope = {
  Button,

  Stack,
  Text,
};

export function ComponentPreview({ code }: { code: string }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="rounded-md overflow-hidden border border-border">
      <div className="p-4 bg-background">
        <LiveProvider code={code} scope={scope}>
          <LivePreview />
          {showCode && (
            <>
              <div className="mt-4 border-t border-border pt-4">
                <LiveEditor className="rounded bg-muted p-4 font-mono text-sm" />
              </div>
              <LiveError className="text-red-500 mt-2" />
            </>
          )}
        </LiveProvider>
      </div>
      <div className="border-t border-border p-2 flex justify-end">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {showCode ? "Hide code" : "Show code"}
        </button>
      </div>
    </div>
  );
}
