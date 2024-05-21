import * as crypto from "node:crypto";
import { mineBlock } from "../lib/miner";
import type { Transaction } from "./transaction";

class Block {
  previousHash: string;
  timestamp: Date;
  transactions: Transaction[];
  hash: string;
  nonce: number;

  constructor(timestamp: Date, transactions: Transaction[], previousHash = "") {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    const hash = crypto.createHash("sha512");
    hash.update(
      `${this.previousHash}${this.timestamp.toISOString()}${JSON.stringify(this.transactions)}${this.nonce}`
    );
    return hash.digest("hex");
  }

  async mineBlock(difficulty: number): Promise<void> {
    await mineBlock(this, difficulty);
    this.hash = this.calculateHash(); // Ensure the hash is recalculated after mining
  }
}

export { Block };
