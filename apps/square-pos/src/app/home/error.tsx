"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/primitives/button";
import { Paragraph } from "@/components/primitives/typography";
import { Box } from "@styled-system/jsx";
import { useEffect } from "react";

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
    <Box padding="padding.block.3xl">
      <Paragraph color="error">Something went wrong.</Paragraph>
      <Paragraph color="error" fontSize="sm">
        {error.message}
      </Paragraph>
      <Button onClick={() => reset()}>Try again</Button>
    </Box>
  );
}
