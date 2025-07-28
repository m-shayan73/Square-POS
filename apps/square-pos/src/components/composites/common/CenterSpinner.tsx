import { Spinner } from "@pallas-ui/components/src/ui/spinner";
import { Box } from "@styled-system/jsx";

export default function CenterSpinner() {
  return (
    <Box
      position="fixed"
      inset="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      data-testid="center-spinner"
    >
      <Spinner color="primary" size="lg" />
    </Box>
  );
}
