import * as lightning from "lightning"
import {config} from "../config"

type OmitLnd<T> = Omit<T, "lnd">

export const {lnd} = lightning.authenticatedLndGrpc(config.get("lnd"))

export async function createInvoice(
	args: OmitLnd<lightning.CreateInvoiceArgs>,
): Promise<lightning.CreateInvoiceResult> {
	return lightning.createInvoice({...args, lnd})
}

export function subscribeToInvoice(
	args: OmitLnd<lightning.SubscribeToInvoiceArgs>,
): ReturnType<typeof lightning.subscribeToInvoice> {
	return lightning.subscribeToInvoice({...args, lnd})
}
