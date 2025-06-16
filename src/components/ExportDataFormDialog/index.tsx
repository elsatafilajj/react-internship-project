import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FolderInput } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { exportNotes } from '@/api/Note/note.client';
import { ExportNotesInput } from '@/api/Note/note.types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getFormikError } from '@/helpers/getFormikError';
import { useForm } from '@/hooks/useForm';
import { ExportSchema } from '@/schemas/ExportSchema';

export const ExportDataFormDialog = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const exportDataMutation = useMutation({
    mutationFn: async (fileType: ExportNotesInput['fileType']) => {
      const response = await exportNotes({
        roomId: roomId || '',
        fileType,
      });
      return { data: response, fileType };
    },
    onSuccess: ({ data, fileType }) => {
      const blob = new Blob([data.data as string], {
        type:
          fileType === 'csv'
            ? 'text/csv'
            : fileType === 'xml'
              ? 'application/xml'
              : fileType === 'pdf'
                ? 'application/pdf'
                : 'application/json',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exported-notes.${fileType}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: async (error: unknown) => {
      let errorMessage = 'Failed to export data. Please try again later.';

      if (error instanceof AxiosError && error.response) {
        const data = error.response.data;

        if (data instanceof Blob) {
          try {
            const text = await data.text();
            const json = JSON.parse(text);
            errorMessage = json.message || errorMessage;
            formik.setFieldError('fileType', errorMessage);
          } catch (parseError) {
            console.error('Failed to parse error blob', parseError);
          }
        }
      }
    },
  });

  const formik = useForm({
    schema: ExportSchema,
    initialValues: { fileType: '' as ExportNotesInput['fileType'] },
    onSubmit: (values) => exportDataMutation.mutateAsync(values.fileType),
  });

  return (
    <div id="export">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="flex items-center gap-2 p-2 justify-start"
            variant="ghost"
          >
            <FolderInput className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose your data file format</DialogTitle>
            <DialogDescription>
              Choose how you want to export your session data!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Select
              onValueChange={(value) => formik.setFieldValue('fileType', value)}
              value={formik.values.fileType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>File Format</SelectLabel>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {getFormikError(formik, 'fileType') && (
              <div className="text-destructive text-sm">
                {getFormikError(formik, 'fileType')}
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                {exportDataMutation.isPending ? 'Downloading...' : 'Export'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
