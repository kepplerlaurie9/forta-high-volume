module.exports = class TransactionCounter {
  constructor(timeIntervalMins) {
    this.timeIntervalMs = timeIntervalMins * 60 * 1000;
    this.transactionMap = {};
  }

  increment(from, txHash, blockTimestamp) {
    if (!this.transactionMap[from]) {
      this.transactionMap[from] = [];
    }

    const blockTimestampMs = blockTimestamp * 1000;
    this.transactionMap[from].push({
      txHash,
      timestamp: blockTimestampMs,
    });
    this.transactionMap[from] = this.transactionMap[from].filter(
      (t) => t.timestamp > blockTimestampMs - this.timeIntervalMs
    );

    return this.transactionMap[from].length;
  }

  getTransactions(from) {
    return this.transactionMap[from]
      ? this.transactionMap[from].map((t) => t.txHash)
      : [];
  }
};