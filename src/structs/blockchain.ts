import { Block, Payload } from "./block";

class Blockchain {
  chain: Block[];
  difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
  }

  createGenesisBlock(): Block {
    return new Block(0, "", new Date(), { sender: "", recipient: "", amount: 0, description: "Genesis block" });
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  isValidPayload(payload: Payload): boolean {
    return payload.sender !== "" && payload.recipient !== "" && payload.amount >= 0;
  }

  isValidBlock(newBlock: Block, previousBlock: Block): boolean {
    return newBlock.index === previousBlock.index + 1 &&
           newBlock.previousHash === previousBlock.hash &&
           newBlock.hash === newBlock.calculateHash();
  }

  async addBlock(newBlock: Block): Promise<void> {
    const latestBlock = this.getLatestBlock();

    if (!this.isValidPayload(newBlock.data)) throw new Error("Invalid payload.");

    newBlock.previousHash = latestBlock.hash;
    await newBlock.mineBlock(this.difficulty);

    if (!this.isValidBlock(newBlock, latestBlock)) throw new Error("Invalid block. Block validation failed.");

    this.chain.push(newBlock);
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
