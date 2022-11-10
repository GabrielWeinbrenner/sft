import "./App.css"
import { useEffect, useState, useMemo } from "react"
import { Metaplex, Nft, Sft, walletAdapterIdentity } from "@metaplex-foundation/js"
import Card from "./components/Card.js"
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js"
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base"
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
let connection = new Connection(clusterApiUrl("devnet"), "confirmed")
const metaplex = new Metaplex(connection)

const tokenAddress = "CxkKDaBvtHqg8aHBVY8E4YYBsCfJkJVsTAEdTo5k4SEw"

function App() {
	const [tokenAdr, setToken] = useState(tokenAddress)
	const [newToken, setNewToken] = useState(tokenAddress)
	const [data, setData] = useState<any>(null)
	const [imageSrc, setImage] = useState<any>(undefined)
	const solNetwork = WalletAdapterNetwork.Devnet
	const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork])
	const { publicKey, sendTransaction, wallet } = useWallet()
	const wallets = useMemo(() => [new PhantomWalletAdapter()], [solNetwork])

	useEffect(() => {
		console.log(metaplex)
		const getNftData = async (publicKey: PublicKey) => {
			const mintAddress = publicKey;
			const nft = await metaplex.nfts().findByMint({
				mintAddress,
			}) 
			console.log(nft)
			setData(nft.json)
			setImage(nft.json?.image)
		}
		getNftData(new PublicKey(tokenAdr))
	}, [tokenAdr])

	useEffect(() => {
		if(wallet){
			metaplex.use(walletAdapterIdentity(wallet?.adapter))
		}
		if(publicKey){
			metaplex.nfts().findAllByCreator({
				creator: publicKey,
			})
		}
	}, [])

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets}>
				<WalletModalProvider>
					<div className="App">
						<WalletConnector />
						<input
							value={newToken}
							onChange={(evt) => setNewToken(evt.target.value)}
							size={100}
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
