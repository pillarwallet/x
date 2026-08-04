import { ethers } from 'ethers';

// Hyperliquid bridge contract on Arbitrum One
export const BRIDGE_CONTRACT_ADDRESS =
  '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7';

// USDC contract on Arbitrum One
export const USDC_CONTRACT_ADDRESS =
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

// Minimal ABI for USDC approve
const USDC_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function nonces(address owner) public view returns (uint256)',
  'function name() public view returns (string)',
  'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public',
];

// Minimal ABI for bridge deposit
const BRIDGE_ABI = [
  'function batchedDepositWithPermit((address user,uint64 usd,uint64 deadline,(uint8 v,bytes32 r,bytes32 s) signature)[] deposits) external',
  'function deposit(uint64 usd) external',
];

export async function checkUSDCBalance(
  walletAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const usdcContract = new ethers.Contract(
    USDC_CONTRACT_ADDRESS,
    USDC_ABI,
    provider
  );
  const balance = await usdcContract.balanceOf(walletAddress);
  return ethers.utils.formatUnits(balance, 6); // USDC has 6 decimals
}

export async function checkUSDCAllowance(
  walletAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const usdcContract = new ethers.Contract(
    USDC_CONTRACT_ADDRESS,
    USDC_ABI,
    provider
  );
  const allowance = await usdcContract.allowance(
    walletAddress,
    BRIDGE_CONTRACT_ADDRESS
  );
  return ethers.utils.formatUnits(allowance, 6);
}

export async function approveUSDC(
  amount: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> {
  const usdcContract = new ethers.Contract(
    USDC_CONTRACT_ADDRESS,
    USDC_ABI,
    signer
  );
  const amountInWei = ethers.utils.parseUnits(amount, 6);
  return await usdcContract.approve(BRIDGE_CONTRACT_ADDRESS, amountInWei);
}

export async function bridgeUSDC(
  recipient: string,
  amount: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> {
  const bridgeContract = new ethers.Contract(
    BRIDGE_CONTRACT_ADDRESS,
    BRIDGE_ABI,
    signer
  );
  const amountInWei = ethers.utils.parseUnits(amount, 6);
  // Bridge2 deposits always credit msg.sender; recipient is ignored for compatibility
  return await bridgeContract.deposit(amountInWei);
}

export async function depositUSDC(
  amount: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> {
  const provider = signer.provider;
  if (!provider) throw new Error('Signer has no provider');
  const owner = await signer.getAddress();
  const usdcContract = new ethers.Contract(
    USDC_CONTRACT_ADDRESS,
    USDC_ABI,
    provider
  );

  const value = ethers.utils.parseUnits(amount, 6);
  const nonce = await usdcContract.nonces(owner);
  const deadline = Math.floor(Date.now() / 1000) + 3600; // +1 hour

  const domain = {
    name: 'USDC',
    version: '2',
    chainId: 42161,
    verifyingContract: USDC_CONTRACT_ADDRESS,
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const message = {
    owner,
    spender: BRIDGE_CONTRACT_ADDRESS,
    value,
    nonce,
    deadline,
  };

  // Sign EIP-2612 Permit
  const sigHex = await (signer as any)._signTypedData(domain, types, message);
  const sig = ethers.utils.splitSignature(sigHex);

  const bridgeContract = new ethers.Contract(
    BRIDGE_CONTRACT_ADDRESS,
    BRIDGE_ABI,
    signer
  );
  const deposits = [
    {
      user: owner,
      usd: value,
      deadline,
      signature: { v: sig.v, r: sig.r, s: sig.s },
    },
  ];

  return await bridgeContract.batchedDepositWithPermit(deposits);
}
