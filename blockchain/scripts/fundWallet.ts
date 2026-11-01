
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [sender] = await ethers.getSigners();

  const walletAddress = "0xbF1D5845E97881736F24e8C5D319683d834231cA";

  const tx = await sender.sendTransaction({
    to: walletAddress,
    value: ethers.parseEther("1"),
  });

  await tx.wait();

  console.log("Test ETH transferred successfully!");
  console.log("Transaction hash:", tx.hash);

  const balance = await ethers.provider.getBalance(walletAddress);

  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
