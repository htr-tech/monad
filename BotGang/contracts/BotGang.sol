// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BotGang is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    mapping(address => Counters.Counter) private _recipientCounters;

	string private constant _IMAGE_URI = "ipfs://bafybeiglt3o6tdrhjhy5momiozgt553zksgkvkuh3lihpprgi4uqpqw4dy";	
    uint256 public constant MINT_PRICE = 69 * 10**18; // 0.69 MON (18 decimals)
    uint256 public MAX_SUPPLY = 100000;
    
    event TokensSent(address indexed sender, address[] recipients, uint256 amount);
    event Minted(address indexed to, uint256 tokenId, uint256 recipientTokenNumber);
    event MaxSupplyChanged(uint256 newMaxSupply);
    event TokenBurned(address indexed owner, uint256 tokenId);

    error TransferRestricted();
    error InsufficientPayment();
    error NoRecipientsProvided();
    error MaxSupplyReached();
    error NotTokenOwner();
    error InvalidMaxSupply();

    constructor() ERC721("BOTGANG Membership Pass", "BOTGANG") {
        _transferOwnership(msg.sender); // Explicitly set owner
    }

    function contractURI() public pure returns (string memory) {
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            '{"name":"BOTGANG Membership Pass",',
            '"description":"Soulbounded-Cult Initiation Protocol",',
            '"image":"', _IMAGE_URI, '",',
            '"external_link":"https://discord.gg/hahawallet",',
            '"seller_fee_basis_points":0,',
            '"fee_recipient":"', Strings.toHexString(uint256(uint160(address(0)))), '"}'
        ));
    }
	
	
    function tokenURI(uint256) public pure override returns (string memory) {
        return string(abi.encodePacked(
            'data:application/json;utf8,',
            '{"name":"BOTGANG Membership Pass",',
            '"description":"Soulbounded-Cult Initiation Protocol",',
            '"image":"', _IMAGE_URI, '",',
            '"attributes":[',            
            '{"trait_type":"Cult","value":"BOTGANG"},',
            '{"trait_type":"Origin","value":"HAHA Wallet"},',           
            '{"trait_type":"Status","value":"Active"},',
            '{"trait_type":"Food","value":"Copium"},',
            '{"trait_type":"Degen Rating","value":"100"},',
            '{"trait_type":"Liquidity Level","value":"0"},',
            '{"trait_type":"Punk Repellent","value":"Yes"},',
            '{"trait_type":"Rugpull Protocol","value":"100"},',
            '{"trait_type":"Weakness","value":"Kenzo"},',
            '{"trait_type":"Punk Nullifier","value":"Yes (Punk Cards? Denied!)"}',
            ']}'
        ));
    }


    function mint(address to) public payable {
        if (_tokenIdCounter.current() >= MAX_SUPPLY) revert MaxSupplyReached();
        
        if (msg.sender != owner()) {
            if (msg.value < MINT_PRICE) revert InsufficientPayment();
        }
        
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _tokenIdCounter.increment();
        _recipientCounters[to].increment();
        
        emit Minted(to, tokenId, _recipientCounters[to].current());
    }

    function multiSend(address[] calldata recipients, uint256 amount) external onlyOwner {
        if (recipients.length == 0) revert NoRecipientsProvided();
        if (_tokenIdCounter.current() + (recipients.length * amount) > MAX_SUPPLY) revert MaxSupplyReached();
        
        uint256 startId = _tokenIdCounter.current();
        
        for (uint256 i = 0; i < recipients.length; ) {
            address recipient = recipients[i];
            for (uint256 j = 0; j < amount; ) {
                uint256 tokenId = startId + (i * amount) + j;
                _safeMint(recipient, tokenId);
                _recipientCounters[recipient].increment();
                emit Minted(recipient, tokenId, _recipientCounters[recipient].current());
                
                unchecked { ++j; }
            }
            unchecked { ++i; }
        }
        
        _tokenIdCounter._value = startId + (recipients.length * amount);
        emit TokensSent(msg.sender, recipients, amount);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function recipientTokenCount(address recipient) external view returns (uint256) {
        return _recipientCounters[recipient].current();
    }

    function transferFrom(address from, address to, uint256 tokenId) public override onlyOwner {
        super.transferFrom(from, to, tokenId);
        _recipientCounters[from].decrement();
        _recipientCounters[to].increment();
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override onlyOwner {
        super.safeTransferFrom(from, to, tokenId);
        _recipientCounters[from].decrement();
        _recipientCounters[to].increment();
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override onlyOwner {
        super.safeTransferFrom(from, to, tokenId, data);
        _recipientCounters[from].decrement();
        _recipientCounters[to].increment();
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function increaseMaxSupply(uint256 amount) external onlyOwner {
        if (amount == 0) revert InvalidMaxSupply();
        MAX_SUPPLY += amount;
        emit MaxSupplyChanged(MAX_SUPPLY);
    }

    function decreaseMaxSupply(uint256 amount) external onlyOwner {
        if (amount == 0 || amount > MAX_SUPPLY) revert InvalidMaxSupply();
        // Ensure new max supply doesn't go below current supply
        if (MAX_SUPPLY - amount < _tokenIdCounter.current()) revert InvalidMaxSupply();
        MAX_SUPPLY -= amount;
        emit MaxSupplyChanged(MAX_SUPPLY);
    }

    function burn(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        
        _burn(tokenId);
        _recipientCounters[msg.sender].decrement();
        emit TokenBurned(msg.sender, tokenId);
    }

    function burnBatch(uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (ownerOf(tokenIds[i]) != msg.sender) revert NotTokenOwner();
            
            _burn(tokenIds[i]);
            _recipientCounters[msg.sender].decrement();
            emit TokenBurned(msg.sender, tokenIds[i]);
        }
    }
}