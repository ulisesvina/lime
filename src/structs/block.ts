import * as crypto from "node:crypto";
import { mineBlock } from "../lib/miner";

type Payload = {
  sender: string;
  recipient: string;
  amount: number;
  description?: string;
};

class Block {
  index: number;
  previousHash: string;
  timestamp: Date;
  data: Payload;
  hash: string;
  nonce: number;

  constructor(index: number, previousHash: string, timestamp: Date, data: Payload) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  public calculateHash(): string {
    const hash = crypto.createHash("sha512");
    hash.update(`${this.index}${this.previousHash}${this.timestamp.toISOString()}${JSON.stringify(this.data)}${this.nonce}`);
    return hash.digest("hex");
  }

  async mineBlock(difficulty: number): Promise<void> {
    await mineBlock(this, difficulty, 4);
  }
}

export { Block, Payload };
