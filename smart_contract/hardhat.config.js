
//https://eth-sepolia.g.alchemy.com/v2/9HPLg43DaD7r36T_-Tx5v
require('@nomiclabs/hardhat-waffle');
require("@nomicfoundation/hardhat-ignition");


module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/9HPLg43DaD7r36T_-Tx5v',
      accounts: ['b834bf13943be6ef6eb4886b6e27b393e0b28d3a5e07414cc3104a8a5a2d33f5']
    }
  }
}
