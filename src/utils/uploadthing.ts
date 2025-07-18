import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';
import { UploadThingError } from 'uploadthing/server';
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';

const f = createUploadthing();
const auth = (req: any) => ({ id: 'fakeId' }); // Replace with real auth

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // You can store file.url in your DB here
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>(); 