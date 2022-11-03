import "./App.css"
import { useEffect, useState, useMemo } from "react"
import { Metaplex } from "@metaplex-foundation/js"
import Card from "./components/Card.js"
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
	GlowWalletAdapter,
	LedgerWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	SolletExtensionWalletAdapter,
	SolletWalletAdapter,
	TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import WalletConnector from "./components/WalletConnector"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import React, { FC, useCallback } from "react"
// const connection = new Connection(clusterApiUrl("mainnet-beta"));
let connection = new Connection(clusterApiUrl("devnet"), "confirmed")
const metaplex = new Metaplex(connection)

const tokenAddress = "CxkKDaBvtHqg8aHBVY8E4YYBsCfJkJVsTAEdTo5k4SEw"
// https://www.arweave.org/

function App() {
	const [tokenAdr, setToken] = useState(tokenAddress)
	const [newToken, setNewToken] = useState(tokenAddress)
	const [data, setData] = useState(null)
	const [imageSrc, setImage] = useState(null)
	const solNetwork = WalletAdapterNetwork.Devnet
	const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork])
	const { publicKey, sendTransaction } = useWallet()
	// initialise all the wallets you want to use
	const wallets = useMemo(() => [new PhantomWalletAdapter()], [solNetwork])

	useEffect(() => {
		console.log(metaplex)
		const loadImageData = async (uri) => {
			const response = await fetch(uri)
			const { image } = await response.json()
			setImage(image)
		}

		const getMetadata = async () => {
			// await loadImageData(metadata.uri);
			// setData(metadata);
		}

		getMetadata()
	}, [tokenAdr])

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets}>
				<WalletModalProvider>
					<div className="App">
						<WalletConnector />

						<input
							value={newToken}
							onChange={(evt) => setNewToken(evt.target.value)}
							size="100"
						/>
						<button onClick={() => setToken(newToken)}>
							Load metadata
						</button>
						{!data ? (
							"Loading..."
						) : (
							<div>
								<Card imageSrc={imageSrc} text={data?.name} />
								<h2>Metadata</h2>
								<pre>{JSON.stringify(data, null, 2)}</pre>
							</div>
						)}
					</div>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}

export default App
