import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMode } from "@/hooks/use-mode";

interface ProfileButtonProps {
  onClick: () => void;
}

export function ProfileButton({ onClick }: ProfileButtonProps) {
  const { mode } = useMode();
  const isBaby = mode === "baby";

  return (
    <Button
      onClick={onClick}
      className={`fixed top-5 right-5 z-40 h-12 w-12 rounded-full p-0 border-2 shadow-lg ${
        isBaby
          ? "bg-pink-200 text-violet-900 hover:bg-pink-300 border-pink-300"
          : "bg-[#FFC107] text-[#1A1A1A] hover:bg-[#ffca2b] border-[#1A1A1A]"
      }`}
      aria-label="Open profile"
    >
      <UserRound className="h-5 w-5" />
    </Button>
  );
}
