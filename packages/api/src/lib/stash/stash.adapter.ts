/** S3 + DynamoDB implementation of Stash port */
import {uniqueId} from "lodash"
import type AWS from "aws-sdk"
import type {Stash} from "./stash.port"

type AdapterArgs = {
	s3: AWS.S3
	bucket: string

	dynamoDb: AWS.DynamoDB
	tableName: string
}

const toS3Metadata = (args: {
	auth: string
	properties: string
	downloadLimit: number
}): {[key: string]: string} => ({
	auth: args.auth,
	properties: args.properties,
	downloadLimit: args.downloadLimit.toString(),
})

const makeRepository = ({
	s3,
	dynamoDb,
	bucket,
	tableName,
}: AdapterArgs): Stash.Repository => {
	const upload: Stash.Upload = async (args) => {
		const key = args.id ?? uniqueId()

		const u = s3.upload({
			Bucket: bucket,
			Key: key,
			Body: args.stream,
			ContentLength: args.length,
			Metadata: toS3Metadata(args),
		})
		if (args.listener) {
			u.on("httpUploadProgress", args.listener)
		}
		await u.promise()

		dynamoDb.putItem({
			TableName: tableName,
			Item: {},
		})

		return {
			key,
			auth: metadata.auth,
			downloads: {
				current: 0,
				limit: metadata.limit,
			},
			length,
			nonce: generateNonce(),
			properties: metadata.properties,
		}
	}
}
