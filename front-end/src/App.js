import React, { useEffect, useState } from 'react';
import {ethers, providers} from "ethers";


import NFT from "./utils/WordHustler.json";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import arrow from "./assets/arrow.svg"
import Loading from './Components/Loading';




// Constants
const TWITTER_HANDLE = 'p_misirov';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/wordhustler';
var TOTAL_MINT_COUNT = 50;

const contractAddress = "0x22660aAe95312Ba458f8fbc09704535901014929";



const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isReceipt, setReceipt] = useState("");
  const [isTokenid, setTokenid] = useState("");
  
 
  // Is the wallet connected? metamask injects the "ethereum" object
  const walletConnected = async () =>{

    const {ethereum} = window;
    if(!ethereum){
      console.log("Please download metamask");
      return;
    
    } else{
      console.log("Ethereum object found", ethereum);
    }

    // Get chain ID, trhow alert if not connected to Rinkeby
    chainID();

    //If site already connnected to metamask, get user public key
    const accounts = await ethereum.request({method: 'eth_accounts'})

    if(accounts.length !== 0){
      const account = accounts[0];
      console.log(`User account: ${account}`);

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      eventListener();

    } else {
      console.log("Site is not authorized to access metamask")
    }

  }


// Function to connect site to the metamask wallet
  const connectWallet = async () => {

    const {ethereum} = window;
    try{
      if(!ethereum){
        alert("Get metamask!");
        return;
      }
      // Connect to metamask wallet
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log(`connected: ${accounts[0]}`)

      setCurrentAccount(accounts[0]);

      eventListener()

    } catch (e){
      console.log(e)
    }
  }


  // function that listens for smart contract events
  const eventListener = async () => {

    const {ethereum} = window;
    try{
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, NFT.abi, signer);

        // webhook, listening for smart contract events
        const event_name = "nftMinted";
        contract.on(event_name, (from, tokenId) => {
          console.log(`From: ${from} , TokenID: ${tokenId}`)

          var id = tokenId.toNumber();
          setTokenid(id)
          // alert(`It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`)
          
        })

      }
      console.log("Setup event listener!")

    } catch(e){
      console.log(e);
    }
  }


  // Get user's current chain ID 
  const chainID = async () => {

    const {ethereum} = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);
    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
  }


  // Mint an NFT and get tx hash
  const mintNFT = async () => {

    const {ethereum} = window;
    try{
      if(ethereum){
        chainID();
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, NFT.abi, signer);

        // pop wallet to pay gas:
        let tx = await contract.mintNFT();
        setLoading(true)
        
        await tx.wait();
        
        console.log(`Transaction mined at https://rinkeby.etherscan.io/tx/${tx.hash}`);
        const hash = tx.hash;

        setReceipt(hash)
        setLoading(false)
      
      }

      setLoading(false)

    } catch(e){
      setLoading(false)
      console.log(e)
    }
  }


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect Wallet
    </button>
  );


  // runs when page loads
  useEffect(() => {
    walletConnected();
  }, []);



  // when user is minting the NFT and waiting for TX to pass:
  if(isLoading){
    return(
      <main>
          <Loading />     
      </main>
    )
  }


  return (
    <div className="App">
      <div className="container">

        <div className="header-container">
          <p className="header gradient-text">NFT Minter</p>
          <p className="sub-text">Jump into the metaverse.</p>
          <p className="nft-count">NFT's left: {TOTAL_MINT_COUNT} / 50</p>
     
          {currentAccount === "" ? renderNotConnectedContainer() : (<button onClick={mintNFT} className="cta-button mint-button">Mint NFT</button>)}

          {/* Start function: if isReceipt is empty, then render nothing. Else when receipt has the hash inside, render a whole container with info inside */}
          {isReceipt === "" ? 
            <div className="receipt">
              <h1></h1>
            </div>
          : (
            <div className="event-container">
              <h3>Your receipt:</h3>
              <div className="receipt">
                <a href={`https://rinkeby.etherscan.io/tx/${isReceipt}`}>View transaction on Etherscan <img src={arrow} className="svg" target="_blank" /> </a>
              </div>
              <div className="opensea">
                <a href={`https://testnets.opensea.io/assets/${contractAddress}/${isTokenid}`}>View NFT on OpenSea 🌊</a>
              </div>
            </div>
          )}
          {/* end function */}

        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer"> {`@${TWITTER_HANDLE}`}</a>
          <a className="footer-text " href={OPENSEA_LINK} target="_blank" rel="noreferrer"> {`🌊 View Collection on OpenSea`}</a>  
        </div>

      </div>
    </div>
  );
  


  

};

export default App;
