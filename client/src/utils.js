import { Connectors } from "web3-react";

const { InjectedConnector, NetworkOnlyConnector } = Connectors;
const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] });

const localHost = new NetworkOnlyConnector({
  providerURL: "localhost:8545"
});

const connectors = { MetaMask, localHost };

export {connectors};