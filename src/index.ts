import { Blockchain } from "./structs/blockchain";
import { Transaction } from "./structs/transaction";

import "dotenv/config";

const blockchain = new Blockchain(),
  testTransaction = new Transaction("Alice", "Bob", 100);

blockchain.createTransaction(testTransaction);
blockchain.minePendingTransactions("Alice");
