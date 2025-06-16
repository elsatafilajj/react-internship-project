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
  triggerButtonName: string | JSX.Element;
  title?: string;
  message?: string;
  onConfirm: () => void;
  className?: string;
}

export const ConfirmActionDialog = ({
  triggerButtonName,
  title,
  message,
  onConfirm,
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
          {triggerButtonName}
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
          <AlertDialogCancel className="bg-white w-[100px] border hover:bg-gray-100 cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-[100px] cursor-pointer"
            onClick={onConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
