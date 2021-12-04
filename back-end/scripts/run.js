
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

    tx_2 = await contract.mintNFT();
    await tx_2.wait();

    tx_3 = await contract.mintNFT();
    await tx_3.wait();

    tx_4 = await contract.mintNFT();
    await tx_4.wait();

    tx_5 = await contract.mintNFT();
    await tx_5.wait();

    var tx_6 = await contract.getTokenNumber()
    console.log(tx_6)


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