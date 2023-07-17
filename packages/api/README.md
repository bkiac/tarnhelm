# Tarnhelm API

## Development

1. Start [Polar](https://github.com/jamaljsr/polar)
1. Create a network with at least one LND node
   - if you use an M1 Mac you will need to custom build your node, see: https://github.com/jamaljsr/polar/blob/master/docs/custom-nodes.md
1. Run `cp .env.development .env` to create your local `.env` file
1. Replace `LND_SOCKET`, `LND_CERT`, `LND_MACAROON` keys in `.env` with your node's connection info
1. Start the network
1. Start stash services with `yarn dev:stash`
1. Start the API service with `yarn dev`
