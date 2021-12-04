
const main = async () => {
    // hre is the "Hardhat Runtome Environment"
    const nftContractFactory = await hre.ethers.getContractFactory('WordHustler'); // compile contract and generate necessary files
    
    const contract = await nftContractFactory.deploy(); // deploy contract to temporal local ethereum blockchain
    await contract.deployed();  // wait until contract is mined and deployed
    console.log("Contract deployed to:", contract.address);
    
    // execute contracts function
    var tx = await contract.mintNFT();
    // wait for tx to be mined
    await tx.wait();
    console.log("Success: Minted NFT 1");

    // tx_2 = await contract.mintNFT();
    // await tx_2.wait();
    // console.log("Minted NFT 2")
  };
 
  


  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();