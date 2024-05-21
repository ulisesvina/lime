import { Block } from "./block";
import { Transaction } from "./transaction";

class Blockchain {
  chain: Block[];
  difficulty: number;
  miningReward: number;
  pendingTransactions: Transaction[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
    this.miningReward = 10;
    this.pendingTransactions = [];
  }

  createGenesisBlock(): Block {
    return new Block(new Date(), [], "0");
  }

  async minePendingTransactions(miningRewardAddress: string) {
    const latestBlock = this.getLatestBlock();
    const block = new Block(
      new Date(),
      this.pendingTransactions,
      latestBlock.hash
    );

    await block.mineBlock(this.difficulty);

    if (!this.isValidBlock(block, latestBlock)) {
      throw new Error("Invalid block.");
    }

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction("", miningRewardAddress, this.miningReward),
    ];
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  isValidTransaction(transaction: Transaction): boolean {
    return (
      transaction.sender !== "" &&
      transaction.recipient !== "" &&
      transaction.amount > 0
    );
  }

  isValidBlock(newBlock: Block, previousBlock: Block): boolean {
    if (newBlock.hash !== newBlock.calculateHash()) return false;
    if (newBlock.previousHash !== previousBlock.hash) return false;
    if (!newBlock.hash.startsWith("0".repeat(this.difficulty))) return false;
    return true;
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    if (!this.isValidTransaction(transaction))
      throw new Error("Invalid transaction.");

    this.pendingTransactions.push(transaction);
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (!this.isValidBlock(currentBlock, previousBlock)) return false;
    }
    return true;
  }
}

export { Blockchain };
