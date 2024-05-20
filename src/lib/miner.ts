import * as crypto from "node:crypto";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { Block } from "../structs/block";

export async function mineBlock(block: Block, difficulty: number, threadCount: number = 4, verbose: boolean = true): Promise<void> {
  if (isMainThread) {
    const target: string = [...Array(difficulty)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
      
    const nonceRange = Math.ceil(Number.MAX_SAFE_INTEGER / threadCount);
    const promises = Array.from({ length: threadCount }, (_, i) => {
      const startNonce = i * nonceRange;
      const endNonce = (i + 1) * nonceRange;
      return createWorkerPromise(block, startNonce, endNonce, difficulty, target);
    });

    const results = await Promise.all(promises);
    const successfulResult = results.find(result => result !== null);
    if (successfulResult) {
      block.nonce = successfulResult!.nonce;
      block.hash = successfulResult!.hash;
      if (verbose) {
        console.log(`Block mined: ${block.hash}`);
        console.log(block)
      }
    } else {
      throw new Error("Failed to mine block.");
    }
  }
}

function createWorkerPromise(block: Block, startNonce: number, endNonce: number, difficulty: number, target: string): Promise<{ nonce: number; hash: string } | null> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: {
        index: block.index,
        previousHash: block.previousHash,
        timestamp: block.timestamp,
        data: block.data,
        difficulty,
        startNonce,
        endNonce,
        target,
      },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

if (!isMainThread) {
  const { index, previousHash, timestamp, data, startNonce, endNonce, target } = workerData;
  for (let nonce = startNonce; nonce < endNonce; nonce++) {
    const hash = crypto.createHash("sha512");
    hash.update(`${index}${previousHash}${timestamp.toISOString()}${JSON.stringify(data)}${nonce}`);
    const digest = hash.digest("hex");
    if (digest.startsWith(target)) {
      parentPort?.postMessage({ nonce, hash: digest });
      process.exit(0);
    }
  }
  parentPort?.postMessage(null);
}
