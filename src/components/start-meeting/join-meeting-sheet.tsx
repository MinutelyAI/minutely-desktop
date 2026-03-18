import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type JoinMeetingSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function JoinMeetingSheet({ open, onOpenChange }: JoinMeetingSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Join Meeting</SheetTitle>
          <SheetDescription>
            Enter a meeting code or link to join an existing meeting.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="meeting-code">Meeting code</Label>
            <Input id="meeting-code" placeholder="Enter code or paste link" />
          </div>
        </div>
        <SheetFooter>
          <Button type="button">Join Meeting</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
