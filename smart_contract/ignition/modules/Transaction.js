const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TransactionsModule", (m) => {
  const transactions = m.contract("Transactions");
  return { transactions };
});
