import { Button } from "@pallas-ui/components/src/ui/button";
import { Flex, VStack } from "@styled-system/jsx";
import { X } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { drawerCloseButton, drawer } from "./styles";

const Drawer = memo(function Drawer({
  open,
  onClose,
  drawerRef,
  children,
}: {
  open: boolean;
  onClose: () => void;
  drawerRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <VStack ref={drawerRef} gap="gap.inline.sm" className={drawer}>
      <Flex justify="flex-end">
        <Button onClick={onClose} variant="text" className={drawerCloseButton}>
          <X size={24} />
        </Button>
      </Flex>

      {children}
    </VStack>
  );
});

export default Drawer;
