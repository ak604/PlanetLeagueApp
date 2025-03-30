import { ethers } from 'ethers';

// PLT Token Details
const PLT_TOKEN_ADDRESS = '0x639e2ae16a57018Bd3ccCCa276e569C386F4395d';
const SKALE_CHAIN_ID = '0x235ddd0';
const SKALE_RPC_URL = 'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet';

// Alternative RPC URLs to try if the primary one fails
const ALTERNATIVE_RPC_URLS = [
  'https://staging-v3.skalenodes.com/v1/staging-nebula',
  'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague'
];

// Simple ERC20 ABI with balanceOf function
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "type": "function"
  }
];

async function validateContractAndNetwork() {
  console.log(`Validating blockchain connection and token contract...`);
  
  // Try each RPC URL in sequence
  for (const rpcUrl of [SKALE_RPC_URL, ...ALTERNATIVE_RPC_URLS]) {
    try {
      console.log(`Trying RPC endpoint: ${rpcUrl}`);
      
      // Initialize provider 
      const provider = new ethers.providers.JsonRpcProvider({
        url: rpcUrl,
        timeout: 30000, // 30 second timeout
      });
      
      // Check if provider can connect
      const network = await provider.getNetwork();
      console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      // Check if the contract address has code
      const code = await provider.getCode(PLT_TOKEN_ADDRESS);
      if (code === '0x') {
        console.log(`No contract found at address ${PLT_TOKEN_ADDRESS} on this network`);
        continue;
      }
      
      console.log(`Contract found at ${PLT_TOKEN_ADDRESS} (code length: ${code.length})`);
      
      // Successfully connected to a network with the contract
      return { provider, valid: true };
    } catch (error: any) {
      console.error(`Failed to connect to ${rpcUrl}:`, error.message || 'Unknown error');
    }
  }
  
  return { provider: null, valid: false };
}

async function checkBalance(walletAddress: string) {
  console.log(`Checking PLT balance for: ${walletAddress}`);
  
  // First validate the contract and network connection
  const { provider, valid } = await validateContractAndNetwork();
  
  if (!valid || !provider) {
    console.log('Could not establish a valid connection to any blockchain endpoint');
    // Generate mock balance as a fallback
    return getMockBalance(walletAddress);
  }
  
  try {
    // Initialize token contract
    const tokenContract = new ethers.Contract(
      PLT_TOKEN_ADDRESS,
      ERC20_ABI,
      provider
    );
    
    // Get token info
    let symbol, decimals;
    
    try {
      symbol = await tokenContract.symbol();
      console.log(`Token symbol: ${symbol}`);
    } catch (error: any) {
      console.error('Error getting token symbol:', error.message || error);
      symbol = 'PLT';
    }
    
    try {
      decimals = await tokenContract.decimals();
      console.log(`Token decimals: ${decimals}`);
    } catch (error: any) {
      console.error('Error getting token decimals, using default (18):', error.message || error);
      decimals = 18;
    }
    
    // Get balance
    try {
      const balanceWei = await tokenContract.balanceOf(walletAddress);
      const balance = ethers.utils.formatUnits(balanceWei, decimals);
      console.log(`PLT Balance: ${balance} ${symbol}`);
      return balance;
    } catch (error: any) {
      console.error('Error getting token balance:', error.message || error);
      return getMockBalance(walletAddress);
    }
  } catch (error: any) {
    console.error('Unexpected error:', error.message || error);
    return getMockBalance(walletAddress);
  }
}

// Mock balance generator function - same as in TokenService.ts
function getMockBalance(walletAddress: string): number {
  console.log('Generating mock balance based on wallet address');
  
  try {
    // Use last 4 chars of address to seed the mock balance
    const seed = parseInt(walletAddress.slice(-4), 16);
    // Generate a balance between 100 and 10000
    return 100 + (seed % 9900);
  } catch {
    // If that fails, return a default mock balance
    return 420.69;
  }
}

// Check balance for the provided address
checkBalance('0xF23A1b7b6AA193FE3cDa46a28a581198Ab50E6a3'); 