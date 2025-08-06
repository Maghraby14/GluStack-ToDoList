import { Alert, AlertText, AlertIcon } from "@/components/ui/alert";
import { InfoIcon } from "@/components/ui/icon";
import { PropsWithChildren } from "react";

type ActionType = "error" | "success" | "warning" | "info"; // Extend as needed

type MyAlertProps = PropsWithChildren<{
  action?: ActionType; // optional with default
}>;

export function MyAlert({ action = "error", children }: MyAlertProps) {
  return (
    <Alert action={action} variant="solid">
      <AlertIcon as={InfoIcon} />
      <AlertText>{children}</AlertText>
    </Alert>
  );
}
