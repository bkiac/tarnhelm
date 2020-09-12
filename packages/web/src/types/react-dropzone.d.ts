import 'react-dropzone';

declare module 'react-dropzone' {
  type DropHandler = <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
}
