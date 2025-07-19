
//https://eth-sepolia.g.alchemy.com/v2/9HPLg43DaD7r36T_-Tx5v
require('@nomiclabs/hardhat-waffle');
require("@nomicfoundation/hardhat-ignition");


module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/9HPLg43DaD7r36T_-Tx5v',
      accounts: [//ADD YOUR PRIVATE KEY]
    }
  }
}
