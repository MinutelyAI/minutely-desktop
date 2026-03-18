import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ScheduleLaterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ScheduleLaterSheet({ open, onOpenChange }: ScheduleLaterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Schedule Meeting</SheetTitle>
          <SheetDescription>
            Set a title and time to schedule this meeting for later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="scheduled-meeting-title">Meeting title</Label>
            <Input id="scheduled-meeting-title" placeholder="Weekly sync" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="scheduled-meeting-time">Date and time</Label>
            <Input id="scheduled-meeting-time" type="datetime-local" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="scheduled-meeting-time">Add Participants</Label>
            <Input id="scheduled-meeting-time" type="email" placeholder="name@company.com" />
          </div>
        </div>
        <SheetFooter>
          <Button type="button">Schedule</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
