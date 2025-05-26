import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmActionDialogProps {
  trigger: string;
  title?: string;
  message?: string;
  customFunction: () => void;
  className?: string;
}

export const ConfirmActionDialog = ({
  trigger,
  title,
  message,
  customFunction,
  className,
}: ConfirmActionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className={className}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full focus:bg-accent focus:text-accent-foreground relative flex justify-start items-center gap-2 rounded-sm px-2 py-1.5 tracking-wide"
        >
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || 'Are you sure you want to delete this?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {message || 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white w-[100px] border hover:bg-gray-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="w-[100px]" onClick={customFunction}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
