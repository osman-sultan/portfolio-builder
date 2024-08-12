"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
} from "@/components/ui/upload";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Trash } from "lucide-react";
import Papa from "papaparse";
import { DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const FileSvgDraw = () => (
  <>
    <svg
      className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Click to upload your ticker data</span>
      &nbsp;or drag and drop
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400">.CSV only</p>
  </>
);

const CardForm = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(1, {
      message: "Only one file is allowed",
    })
    .nullable(),
});

type CardFormType = z.infer<typeof CardForm>;

const validateCSV = (data: string[][]): boolean => {
  if (data.length === 0) {
    toast.error("CSV file is empty.");
    return false;
  }

  const headers = data[0];
  if (headers.length < 2) {
    toast.error("CSV must have at least two columns: Date and one ticker.");
    return false;
  }

  if (headers[0].toLowerCase() !== "date") {
    toast.error('The first column must be "Date".');
    return false;
  }

  return true;
};

type FileUploadZoneProps = {
  onDataParsed: (
    tickerData: { value: string; label: string }[],
    fullData: any[]
  ) => void;
};

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onDataParsed,
}) => {
  const form = useForm<CardFormType>({
    resolver: zodResolver(CardForm),
    defaultValues: {
      files: null,
    },
  });

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    multiple: true,
    accept: {
      "text/csv": [".csv"],
    },
  };

  const handleFileRemove = () => {
    form.setValue("files", []);
  };

  const onSubmit = (data: CardFormType) => {
    if (data.files && data.files.length > 0) {
      const file = data.files[0];
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<{ [key: string]: any }>) => {
          if (results.errors.length) {
            toast.error("Errors while parsing the CSV file.");
          } else {
            const isValid = validateCSV(
              results.data.map((row) => Object.keys(row))
            );
            if (isValid) {
              const headers = results.data.map((row) => Object.keys(row))[0];
              const tickerData = headers.slice(1).map((header) => ({
                value: header.toLowerCase(),
                label: header.toUpperCase(),
              }));
              onDataParsed(tickerData, results.data); // Pass both tickerData and full CSV data to parent component
              toast.success("Your data is now ready for use!");
            }
          }
        },
      });
    } else {
      toast.error("No valid CSV data to submit.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full flex flex-col items-center"
      >
        <div className="max-w-md w-full">
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropZoneConfig}
                  reSelect={true}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput className="outline-dashed outline-2 outline-gray-300 dark:outline-white">
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                      <FileSvgDraw />
                    </div>
                  </FileInput>
                  {field.value && field.value.length > 0 && (
                    <FileUploaderContent>
                      {field.value.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={handleFileRemove}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </FileUploaderContent>
                  )}
                </FileUploader>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className={cn(
            "mt-4 mx-auto block",
            !form.watch("files")?.length && "cursor-not-allowed opacity-50"
          )}
          disabled={!form.watch("files")?.length}
        >
          {form.watch("files")?.length
            ? "Use this data"
            : "No data uploaded yet"}
        </Button>
      </form>
    </Form>
  );
};

export default FileUploadZone;
