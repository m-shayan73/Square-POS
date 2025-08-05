"use client";

import Login from "@/components/composites/login";
import { CenterSpinner } from "@/components/primitives/spinner";
import { Box } from "@styled-system/jsx/box";
import { useSession } from "next-auth/react";

export default function RootPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Box width="screen" height="screen">
        <CenterSpinner />
      </Box>
    );
  }

  return <Login />;
}
