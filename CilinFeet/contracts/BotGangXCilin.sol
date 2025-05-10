// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BotGangXCilin is ERC721, ERC721Burnable, ERC721Royalty, Ownable {
    uint256 public constant MAX_SUPPLY = 691;
    uint256 private _tokenIdCounter;
    bool private _tradingFrozen;
    string private _baseTokenURI1; // First base URI
    string private _baseTokenURI2; // Second base URI
    address private immutable _royaltyReceiver; 
    event TradingFrozen(bool frozen);

    constructor(
        address initialOwner,
        address royaltyReceiver
    ) ERC721("BOTGANG x CILINFEET Collection", "BOTGANGXCILIN") Ownable(initialOwner) {
        _baseTokenURI1 = "https://gateway.pinata.cloud/ipfs/bafybeiduckk3nrdorc4pinqu3xigqhcpuwvalh4k7c676eset4orhdbygi/";
        _baseTokenURI2 = "https://gateway.pinata.cloud/ipfs/bafybeihppzvop4uaaqhjq7gej3wckink6ip4l4f457uvopjnwhgpv452me/";
        _royaltyReceiver = royaltyReceiver;
        _tradingFrozen = false;
        _setDefaultRoyalty(royaltyReceiver, 200);
    }

    function contractURI() public pure returns (string memory) {
        return string(
            abi.encodePacked(
                'data:application/json;utf8,',
                '{',
                    '"name":"BOTGANG x CILINFEET Collection",',
                    unicode'"description":"For the chosen few who held Cilin Feet. Mommy Cilin cooked up 691 unique pieces of art, just for her loyal little weirdos. Its for fun only. No utility. Dont DM mommy. 🦶🤣",',
                    '"image":"https://rose-near-lemur-406.mypinata.cloud/ipfs/bafkreicvnxywg76gsqn3jprnbuq4uczd25ntdplcbnpb7hshwk3vd4wsza",',
                    '"external_url":"https://x.com/officialbotgang",',
                    '"seller_fee_basis_points":200,',
                    '"fee_recipient":"0x........",',
                    '"total_supply":691',
                '}'
            )
        );
    }


    // Hardcoded tokenURI with dynamic image URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721: invalid token ID");
        string memory baseURI = tokenId <= 400 ? _baseTokenURI1 : _baseTokenURI2;
        return
            string(
                abi.encodePacked(
                    'data:application/json;utf8,',
                    '{"name":"BOTGANG x CILINFEET Collection",',
                    '"description":"One of 691 cursed blessings from Mommy Cilin herself.",',
                    '"image":"', baseURI, Strings.toString(tokenId), '.png",',
                    '"attributes":[',
                    '{"trait_type":"Cult","value":"BOTGANG"},',
                    '{"trait_type":"Mommy","value":"Cilin"},',
                    '{"trait_type":"Origin","value":"HaHa Wallet"},',
                    '{"trait_type":"Weakness","value":"Karma"}',
                    ']}'
                )
            );
    }

    function maxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    // Mint function (only owner)
    function mint(address to) external onlyOwner {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
    }

    // Multisend function (mint to multiple addresses, only owner)
    function multiSend(address[] calldata recipients) external onlyOwner {
        require(recipients.length > 0, "No recipients provided");
        for (uint256 i = 0; i < recipients.length; i++) {
            require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
            _tokenIdCounter++;
            _safeMint(recipients[i], _tokenIdCounter);
        }
    }

    // Freeze or unfreeze trading (only owner)
    function setTradingFrozen(bool frozen) external onlyOwner {
        _tradingFrozen = frozen;
        emit TradingFrozen(frozen);
    }

    // Check if trading is frozen
    function isTradingFrozen() public view returns (bool) {
        return _tradingFrozen;
    }

    // Override transfer functions to respect trading freeze
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        require(!_tradingFrozen || msg.sender == owner(), "Trading is frozen");
        return super._update(to, tokenId, auth);
    }

    // Burn token (extends ERC721Burnable)
    function burn(uint256 tokenId) public override {
        super.burn(tokenId);
        _resetTokenRoyalty(tokenId); // Reset royalty for burned token
    }

    // Get current token supply
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Support royalty info
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
