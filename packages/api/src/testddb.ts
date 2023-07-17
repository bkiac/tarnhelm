// Create the DynamoDB service client module using ES6 syntax.
import {
	DynamoDBClient,
	PutItemCommand,
	GetItemCommand,
} from "@aws-sdk/client-dynamodb"

const TableName = "tarnhelm-db"
const accessKeyId = "AKIAVWJF77OCIOC6ED7U"
const secretAccessKey = "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"

export const ddb = new DynamoDBClient({
	region: "us-west-2",
	credentials: {accessKeyId, secretAccessKey},
})

async function main() {
	const asd = new PutItemCommand({
		TableName,
		Item: {
			id: {S: "id"},
			downloads: {N: "0"},
		},
	})
	const res = await ddb.send(asd)
	console.log(res)
	const getasd = new GetItemCommand({
		TableName,
		Key: {id: {S: "id"}},
	})
	const res2 = await ddb.send(getasd)
	console.log(res2)
}
void main()
