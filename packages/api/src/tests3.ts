import AWS from "aws-sdk"

const bucket = "tarnhelm-storage"

const s3 = new AWS.S3({
	accessKeyId: "AKIAVWJF77OCIOC6ED7U",
	secretAccessKey: "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",
	s3ForcePathStyle: true,
	signatureVersion: "v4",
})

async function main() {
	const res = await s3
		.putObject({
			Bucket: bucket,
			Key: "asd",
			Metadata: {
				asd: "asd2",
			},
			// Body: "hello",
		})
		.promise()
	// console.log(res)
	// const res2 = await s3
	// 	.getObject({
	// 		Bucket: bucket,
	// 		Key: "asd",
	// 	})
	// 	.promise()
	// console.log(res2.Metadata, res2.ContentLength)
	// const res3 = await s3.headObject({Bucket: bucket, Key: "asd"}).promise()
}

void main()
