import "react-dropzone"

declare module "react-dropzone" {
	export type DropHandler = <T extends File>(
		acceptedFiles: T[],
		fileRejections: FileRejection[],
		event: DropEvent,
	) => void
}
