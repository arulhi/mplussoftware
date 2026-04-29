import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const fileSchema = z
  .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
    message: "File is required",
  })
  .refine((files) => files.item(0)?.size! <= MAX_FILE_SIZE, {
    message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  })
  .refine((files) => ACCEPTED_FILE_TYPES.includes(files.item(0)?.type!), {
    message: "Only JPG, PNG, and PDF files are allowed",
  });
