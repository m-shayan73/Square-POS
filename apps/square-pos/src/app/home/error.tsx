"use client"; // Error boundaries must be Client Components

import { VStack } from "@styled-system/jsx";
import { Paragraph } from "@pallas-ui/components/src/ui/typography";
import { useEffect } from "react";
import { Button } from "@pallas-ui/components/src/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <VStack>
      <Paragraph color="error">Something went wrong.</Paragraph>
      <Button onClick={reset}>Try again</Button>
    </VStack>
  );
}
