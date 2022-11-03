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
		if (!publicKey) throw new WalletNotConnectedError()
		const lamports = await connection.getMinimumBalanceForRentExemption(100)
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: publicKey,
				toPubkey: Keypair.generate().publicKey,
				lamports,
			})
		)

		const {
			context: { slot: minContextSlot },
			value: { blockhash, lastValidBlockHeight },
		} = await connection.getLatestBlockhashAndContext()

		const signature = await sendTransaction(transaction, connection, {
			minContextSlot,
		})

		await connection.confirmTransaction({
			blockhash,
			lastValidBlockHeight,
			signature,
		})
		console.log(wallet)
		metaplex.use(walletAdapterIdentity(wallet))
		// const nft = await metaplex.nfts().findByMint(
		//     {
		//         mintAddress
		//     }
		// );
		const { uri } = await metaplex.nfts().uploadMetadata({
			name: "My off-chain name",
			description: "My off-chain description",
			image: "https://arweave.net/123",
		})

		const { nft } = await metaplex.nfts().create({
			uri,
			name: "My on-chain NFT",
			sellerFeeBasisPoints: 250, // 2.5%
		})
		console.log(nft)

		console.log(nft)
	}, [publicKey, sendTransaction, connection])

	return (
		<div>
			<WalletMultiButton />
			<button onClick={onClick} disabled={!publicKey}>
				Send SOL to a random address!
			</button>
		</div>
	)
}

export default WalletConnector
