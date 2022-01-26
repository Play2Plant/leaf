## `LeafNft`

This token allows players to enter the game




### `constructor(string _name, string _symbol, string _initBaseURI)` (public)



mint first 10 NFTs with NFT levels for owner


### `firstMint(address _to) → string` (external)



player receives his first NFT


### `nextMint(address _to, uint256 _level) → string` (external)



player receives his auther NFTs


### `mintOwner(uint256 _nbNft)` (public)



mint _nbNft NFTs of each level for owner


### `tokenURIIpfs(uint256 _nftId) → string` (internal)



ex: nftId = 45 => ipfs://BASE_URI/45.json


### `_baseURI() → string` (internal)





### `getIdsNftByAddress(address _address) → uint256[]` (external)



for players the table can contain a maximum of 4 elements, for owner more


### `setBaseURI(string _newBaseURI)` (public)



change base URL by _newBaseURI


### `getBaseURI() → string` (external)





### `setBaseExtension(string _newBaseExtension)` (external)



change base extension .json by _newBaseExtension


### `getBaseExtension() → string` (external)





### `getSupply() → uint256` (external)



return parameter firstLevelSupply





