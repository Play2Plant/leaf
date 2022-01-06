// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LEAF.sol";

contract LeafDapp is Ownable {

  uint constant MIN_PRICE = 50000000000000;

  LEAF public leaf;

  struct Player {
    uint32 oldNbStep;
    uint32 nbDaySuccess;
    uint lastSync;
    address addressNFT;
  }

  mapping (address => Player) public players;

  event LeafBuyed(address _address, uint amountLeaf);
  event LeafWins(address _address, uint amountLeaf);

  constructor(uint _totalSupply) {
    leaf = new LEAF(_totalSupply);
    leaf.mint();
  }

  /// @notice can buy at least 1 Leaf
  function buyLeaf() payable external {
    uint amountTobuy = msg.value;
    uint amountLeaf = weiToLeaf(amountTobuy);
    uint dappBalance = balanceDappLeaf();
    require(amountTobuy >= MIN_PRICE, "LeafDApp : must be greater than 0.00005 ETH");
    require(amountLeaf <= dappBalance, "LeafDApp : not enough leafs in the reserve");

    leaf.transfer(msg.sender, amountLeaf);

    emit LeafBuyed(msg.sender, amountLeaf);
  }

  /// @dev 10000 Step = 10Leaf (10*100) 
  /// @dev 13875 Step = 13.87 Leaf (1387) 
  function stepToLeaf(uint32 _nbStep) external {
    require(block.timestamp - players[msg.sender].lastSync >= 1 days,
      "LeafDApp : a day has not passed yet");
    
    players[msg.sender].lastSync = block.timestamp;

    uint amountLeaf = _nbStep / 10;
    if(_nbStep >= 10000) {
      leaf.transfer(msg.sender, amountLeaf);
      players[msg.sender].nbDaySuccess++;
      players[msg.sender].oldNbStep = _nbStep;
    } else {
      players[msg.sender].nbDaySuccess = 0;
    }

    emit LeafWins(msg.sender, amountLeaf);
  }

  function stepToLeafByAddress(address _address, uint32 _nbStep) external {
    require(block.timestamp - players[msg.sender].lastSync >= 1 days,
      "LeafDApp : a day has not passed yet");
    
    players[_address].lastSync = block.timestamp;

    if(_nbStep >= 10000) {
      leaf.transfer(_address, _nbStep / 10);
      players[_address].nbDaySuccess++;
      players[_address].oldNbStep = _nbStep;
    } else {
      players[_address].nbDaySuccess = 0;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  //   OWNER FUNCTIONS
  //////////////////////////////////////////////////////////////////////////
  function withdraw(uint _amount) external onlyOwner {
    payable(owner()).transfer(_amount);
  }

  //////////////////////////////////////////////////////////////////////////
  //   UTILE FUNCTIONS
  //////////////////////////////////////////////////////////////////////////

  /**
   * @dev 1 LEAF = 50000000000000 Wei OR 1 LEAF = 0,00005 ETH
   * @notice 1 Leaf is stocked 100 (ex 1.75 Leaf => 175)
   */
  function weiToLeaf(uint _amountWei) internal pure returns(uint) {
    uint leafToWei = 50000000000000;
    uint precision = 100;

    return _amountWei * precision / leafToWei;
  }


  //////////////////////////////////////////////////////////////////////////
  //   BALANCES
  //////////////////////////////////////////////////////////////////////////

  function balance() external view returns(uint) {
    return leaf.balanceOf(address(msg.sender));
  }

  function balanceDappLeaf() public view returns(uint) {
    return leaf.balanceOf(address(this));
  }

  function balanceDappEth() external view returns(uint) {
    return address(this).balance;
  }

}