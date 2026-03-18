import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type InviteParticipantsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InviteParticipantsSheet({ open, onOpenChange }: InviteParticipantsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite Participants</SheetTitle>
          <SheetDescription>
            Send an invite by entering one or more email addresses.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="participant-emails">Email addresses</Label>
            <Input id="participant-emails" placeholder="name@company.com" />
          </div>
        </div>
        <SheetFooter>
          <Button type="button">Send Invites</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
