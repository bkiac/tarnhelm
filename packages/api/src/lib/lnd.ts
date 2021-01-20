import * as lns from "ln-service"
import { config } from "../config"

export const { lnd } = lns.authenticatedLndGrpc(config.get("lnd"))

export async function createInvoice(
	args: lns.CreateInvoiceArgs,
): Promise<lns.CreateInvoiceResult> {
	return lns.createInvoice({ ...args, lnd })
}

export function subscribeToInvoice(
	args: lns.SubscribeToInvoiceArgs,
): ReturnType<typeof lns.subscribeToInvoice> {
	return lns.subscribeToInvoice({ ...args, lnd })
}
