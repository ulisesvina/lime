import { Blockchain } from "./structs/blockchain";
import { Block } from "./structs/block";
import "dotenv/config";

const blockchain = new Blockchain();

const testBlock1 = new Block(
  blockchain.getLatestBlock().index + 1,
  blockchain.getLatestBlock().hash,
  new Date(),
  {
    sender: "John Doe",
    recipient: "Jane Doe",
    amount: 0,
    description: "test block #1",
  }
);

blockchain.addBlock(testBlock1);

const testBlock2 = new Block(
  blockchain.getLatestBlock().index + 1,
  blockchain.getLatestBlock().hash,
  new Date(),
  {
    sender: "Jane Doe",
    recipient: "John Doe",
    amount: 0,
    description: "test block #2",
  }
);

blockchain.addBlock(testBlock2);
