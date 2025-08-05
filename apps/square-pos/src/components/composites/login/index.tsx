"use client";

import { Button } from "@/components/primitives/button";
import { Center } from "@styled-system/jsx";
import { signIn } from "next-auth/react";
import Image from "next/image";

const loginButton = {
  fontSize: "lg",
  height: "fit-content",
};

export default function Login() {
  return (
    <Center h="screen" w="screen" data-testid="login-root">
      <Button
        onClick={() => signIn("square", { callbackUrl: "/home" })}
        variant="default"
        size="lg"
        css={loginButton}
      >
        <Image
          src="/square-logo-black.svg"
          alt="Square Logo"
          width={32}
          height={32}
        />
        <span>Sign in with Square</span>
      </Button>
    </Center>
  );
}
