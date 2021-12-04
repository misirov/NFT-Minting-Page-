//SPDX License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "../libraries/Base64.sol";

contract WordHustler is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public maxSupply = 49;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: #c3c; font-family: sans-serif; font-size: 15px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
    string baseSvgEnd = "</text></svg>";

    string[] firstWords = ["Powerful","Demential","Algorithmic","","Introvert","Irrational", "Loco", "Perfect", "Busy", "Cautious"];
    string[] secondWords = ["Sasuke","Senpai","Pikachu","Batman","Elon","Einstein", "Cell", "Teacher", "Qu1ckSc0pErZ"];
    string[] thirdWords = ["9000","420","69","666","_0_0","1234", "9090", "25", "<-_->"];

    event nftMinted(address sender, uint256 tokenId);

    constructor() ERC721("WordHustler", "WHustle"){
        console.log("Logging WordHustler NFT Contract wagmi");
    }


    function random(string memory _input) internal pure returns(uint256){
        return uint256(keccak256(abi.encodePacked(_input)));
    }

    function pickRandomFirstWord(uint256 _tokenId) public view returns (string memory){
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(_tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 _tokenId) public view returns(string memory){
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(_tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    } 

    function pickRandomThirdWord(uint256 _tokenId) public view returns(string memory){
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(_tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }


    // function getNumber() public view returns(uint256){
    //     return _tokenIds;
    // }


    function mintNFT() public {
        uint256 newItemId = _tokenIds.current();
        require(newItemId <= maxSupply, "No more Limited edition Tokens to mint.");

        string memory wordOne = pickRandomFirstWord(newItemId);
        string memory wordTwo = pickRandomSecondWord(newItemId);
        string memory wordThree = pickRandomThirdWord(newItemId);

        string memory combinedWord = string(abi.encodePacked(wordOne, wordTwo, wordThree));
        console.log("Word 1: %s", wordOne);
        console.log("Word 2: %s", wordTwo);
        console.log("Word 3: %s", wordThree);

        string memory finalSvg = string(abi.encodePacked(baseSvg, wordOne, wordTwo, wordThree, "</text></svg>"));
            console.log("-------------------------------------:");
            console.log(finalSvg);
            console.log("-------------------------------------");

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,",json));

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId,finalTokenURI);
            console.log("- New NFT with id: %s \n- minted to address: %s \n- tokenURI: %s \n", newItemId, msg.sender, finalTokenURI);
        _tokenIds.increment();

        emit nftMinted(msg.sender, newItemId);
    }

    function getTokenNumber() public view returns(uint256){
        console.log("Calling getTokenNumber: ");
        return _tokenIds.current();
    }

}


