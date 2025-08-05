import { Button } from "@/components/primitives/button";
import Toast from "@/components/primitives/toast";
import { Paragraph } from "@/components/primitives/typography";
import { css } from "@styled-system/css";
import { Box } from "@styled-system/jsx";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

interface OrderToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const toastStyles = css({
  backgroundColor: "success.bg",
  color: "success.text",
});

export default function OrderToast({ open, setOpen }: OrderToastProps) {
  const now = new Date();
  const formattedDate = now.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Toast.Provider>
      <Toast.Root
        placement="topRight"
        open={open}
        onOpenChange={setOpen}
        className={toastStyles}
      >
        <Toast.Icon color="text">
          <ShoppingBag size={20}/>
        </Toast.Icon>
        <Toast.Title>Checkout Successful</Toast.Title>
        <Toast.Description>{formattedDate}</Toast.Description>
        <Toast.Close asChild>
          <Button variant="dashed" size="sm">
            <X size={16} />
          </Button>
        </Toast.Close>
        <Toast.Actions justifyContent="flex-end">
          <Toast.Action altText="View orders">
            <Link href="/orders">
              <Paragraph
                display="flex"
                alignItems="center"
                size="subscript"
                color="secondary"
                textStyle="underline"
                className={"group"}
              >
                View orders
                <Box
                  css={{
                    transition: "transform",
                    _groupHover: {
                      transform: "translateX(2px)",
                      color: "success.textActive"
                    },
                  }}
                >
                  <ArrowRight size={16} />
                </Box>
              </Paragraph>
            </Link>
          </Toast.Action>
        </Toast.Actions>
      </Toast.Root>
      <Toast.Viewport placement={"topRight"} />
    </Toast.Provider>
  );
}
