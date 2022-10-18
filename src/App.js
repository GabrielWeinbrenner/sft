import "./App.css";
import { useEffect, useState } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import Card from "./components/Card.js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("mainnet-beta"));
let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const metaplex = new Metaplex(connection);

const tokenAddress = "CxkKDaBvtHqg8aHBVY8E4YYBsCfJkJVsTAEdTo5k4SEw";
// https://www.arweave.org/

function App() {
  const [tokenAdr, setToken] = useState(tokenAddress);
  const [newToken, setNewToken] = useState(tokenAddress);
  const [data, setData] = useState(null);
  const [imageSrc, setImage] = useState(null);
  // const metaplex = Metaplex.make(connection)
  //   .use(keypairIdentity(wallet))
  //   .use(bundlrStorage());

  useEffect(() => {
    console.log(metaplex.nfts())
    const loadImageData = async (uri) => {
      const response = await fetch(uri);
      const { image } = await response.json();
      setImage(image);
    };
    const getMetadata = async () => {
      // const mintAddress = new PublicKey("B7GR9gc6RgMTJh2dzfLpexKUVxq6ZkBNF4BimoHXXctb");
      // const nft = await metaplex.nfts().findByMint(
      //   {
      //     mintAddress
      //   }
      // );
      // const { uri } = await metaplex
      //   .nfts()
      //   .uploadMetadata({
      //     name: "My off-chain name",
      //     description: "My off-chain description",
      //     image: "https://arweave.net/123",
      //   })
      
      const { nft } = await metaplex
      .nfts()
      .create({
          uri: "1342",
          name: 'My on-chain NFT',
          sellerFeeBasisPoints: 250, // 2.5%
      })
      console.log(nft)
      // await loadImageData(metadata.uri);
      // setData(metadata);
    };

    getMetadata();
  }, [tokenAdr]);

  return (
    <div className="App">
      <input
        value={newToken}
        onChange={(evt) => setNewToken(evt.target.value)}
        size="100"
      />
      <button onClick={() => setToken(newToken)}>Load metadata</button>
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
  );
}

export default App;
