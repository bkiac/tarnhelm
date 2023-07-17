/* eslint-disable no-console */
import {Upload} from "@aws-sdk/lib-storage"
import {S3} from "@aws-sdk/client-s3"

const Bucket = "tarnhelm-storage"
const accessKeyId = "AKIAVWJF77OCIOC6ED7U"
const secretAccessKey = "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"

async function main(): Promise<void> {
	try {
		const client = new S3({
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
			region: "us-west-2",
		})
		const parallelUploads3 = new Upload({
			client,
			params: {Bucket, Key: "ye2", Body: "asdasdasdasd"},
		})

		parallelUploads3.on("httpUploadProgress", (progress) => {
			console.log(progress)
		})

		await parallelUploads3.done()

		const res = await client.headObject({
			Key: "ye2",
			Bucket,
		})
		console.log(res)
	} catch (e: unknown) {
		console.log(e)
	}
}
void main()
