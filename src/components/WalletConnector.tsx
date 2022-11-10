import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import { SystemProgram, Transaction } from "@solana/web3.js"
import React, { FC, useCallback } from "react"
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"

let connection = new Connection(clusterApiUrl("devnet"), "confirmed")
const metaplex = new Metaplex(connection)
const WalletConnector = () => {
	const { connection } = useConnection()
	const { publicKey, sendTransaction, wallet, wallets } = useWallet()

	const onClick = useCallback(async () => {
		if(wallet){
			metaplex.use(walletAdapterIdentity(wallet?.adapter))
		}
		const { nft } = await metaplex.nfts().create({
			uri: "https://arweave.net/kvcs7TChT5MioXXuUdjq9wjiEFSFASxOWSaJ6ff9gNQ",
			symbol: "HFT",
			name: Math.random().toString(),
			sellerFeeBasisPoints: 250,
		})

		console.log(nft)
	}, [])

	const findNFTsByOwner = useCallback(async () => {
		let nfts = {}
		console.log(publicKey)
		if(publicKey){
			nfts = await metaplex.nfts().findAllByCreator({
				creator: publicKey,
			})
		}
		console.log(nfts);
	}, [])
	return (
		<div>
			<WalletMultiButton />
			<button onClick={onClick} disabled={!publicKey}>
				Mint NFTs
			</button>
			<button onClick={findNFTsByOwner} disabled={!publicKey}>
				Find NFTs
			</button>
		</div>
	)
}

export default WalletConnector
