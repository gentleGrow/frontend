import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LoginDialog } from "@/features";

export default function LoginMenuItem() {
  return (
    <>
      <DropdownMenuItem asChild>
        <LoginDialog />
      </DropdownMenuItem>
    </>
  );
}
