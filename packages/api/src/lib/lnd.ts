import * as lightning from "lightning"
import {config} from "../config"

export const {lnd} = lightning.authenticatedLndGrpc(config.get("lnd"))

export async function createInvoice(
	args: lightning.CreateInvoiceArgs,
): Promise<lightning.CreateInvoiceResult> {
	return lightning.createInvoice({...args, lnd})
}

export function subscribeToInvoice(
	args: lightning.SubscribeToInvoiceArgs,
): ReturnType<typeof lightning.subscribeToInvoice> {
	return lightning.subscribeToInvoice({...args, lnd})
}
