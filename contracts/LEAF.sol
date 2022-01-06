// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LEAF is ERC20, Ownable {

    uint public totalLeaf;
    bool public mintOnce;

    constructor(uint _totalSupply) ERC20("Token Leaf", "LEAF") {
        totalLeaf = _totalSupply;
    }

    /// @dev mint just once with total supply to owner (ContractLeaf) address 
    function mint(/* address dapp */) external onlyOwner {
      require(!mintOnce, "LEAF: you can mint once");

      // _mint(dapp, totalLeaf);
      _mint(msg.sender, totalLeaf);

      mintOnce = true;
    }

    /// @dev verification of amount/balance is done in _burn
    function burn(uint amount) external onlyOwner{
      require(amount <= totalLeaf, "LEAF: cant burn");
      _burn(msg.sender, amount);
    }
}
