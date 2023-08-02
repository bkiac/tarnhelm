import { authenticatedLndGrpc } from "lightning";

export const { lnd } = authenticatedLndGrpc({
	cert: "<base64 cert>",
	macaroon:
		"<base64 macaroon>",
	socket: "lnd-internal:10009",
});
