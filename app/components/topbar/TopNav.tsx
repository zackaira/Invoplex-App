import { ModeToggle } from "@/app/components/topbar/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Modal from "../modal/Modal";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
      </div>

      {/* Left side - Navigation tabs */}
      <h1 className="flex items-center gap-6 flex-1">Dashboard</h1>

      {/* Right side - User avatar */}
      <div className="flex items-center gap-4">
        <ModeToggle />

        <Modal
          title="Add Client"
          description="Add a new client to your business"
          trigger={<Button>Add Client</Button>}
          cancelBtnText="Cancel"
        />
      </div>
    </header>
  );
}
