class Transaction {
  sender: string;
  recipient: string;
  amount: number;
  description?: string;

  constructor(sender: string, recipient: string, amount: number) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
  }
}

export { Transaction };
