const AgentPayBatchSimulator = artifacts.require("AgentPayBatchSimulator");

module.exports = async function(deployer, network, accounts) {
  // Nile 测试网 USDT 合约地址
  const usdtAddress = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";
  
  console.log("Deploying AgentPayBatchSimulator...");
  console.log("USDT Address:", usdtAddress);
  
  await deployer.deploy(AgentPayBatchSimulator, usdtAddress);
  
  const instance = await AgentPayBatchSimulator.deployed();
  console.log("AgentPayBatchSimulator deployed at:", instance.address);
};
