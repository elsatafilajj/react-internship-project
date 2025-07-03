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
        <AlertDialogFooter className=" w-full">
          <AlertDialogCancel className="bg-gray-100 border hover:bg-gray-200 cursor-pointer w-full md:w-[100px]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-full md:w-[100px] cursor-pointer"
            onClick={onConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
