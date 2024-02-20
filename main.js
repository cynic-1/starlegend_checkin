const ethers = require('ethers');

require('dotenv').config();
const privateKeyList = process.env.PRIVATE_KEY.split(',');
const pNum = Number(process.argv[2])-1;
const privateKey = privateKeyList[pNum];

// RPC节点URL
const rpcUrl = 'https://polygon-pokt.nodies.app'

// 使用给定的RPC节点初始化provider
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// 通过私钥和provider创建钱包实例
const wallet = new ethers.Wallet(privateKey, provider);

const data = '0x1249c58b';


// 发送交易的函数
async function sendTransaction() {
  const feeData = await provider.getFeeData();
  const walletAddress = wallet.address;
  const contractAddress = '0x777b425f6bf8474b0e61f42e880d09e610a9400e'

  // 设置交易的参数
  const tx = {
    to: contractAddress, // 接收者地址设置为钱包自身地址
    value: ethers.utils.parseEther('0'), // 转账金额
    data: data,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
  };

  try {
    // 发送交易
    const transactionResponse = await wallet.sendTransaction(tx);
    console.log(`Account ${walletAddress} send transaction`);

    // 等待交易被挖出
    await transactionResponse.wait();
    console.log(`Account ${walletAddress} transaction successful with hash: ${transactionResponse.hash}.`);
  } catch (error) {
    console.error(`Account ${walletAddress} transaction failed with hash: ${transactionResponse.hash}, error: ${error.message}`);
  }
}

// 生成一个介于 min 和 max 秒之间的随机数
function getRandomSleepTimeMin(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)*1000;
}

// 随机睡眠时间的函数
function randomSleep(min, max) {
  const randomTime = getRandomSleepTimeMin(min, max);
  return new Promise(resolve => setTimeout(resolve, randomTime));
}

randomSleep(1, 10).then(() => {
  sendTransaction();
});
