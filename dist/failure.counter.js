"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FailureCounter = /** @class */ (function () {
    function FailureCounter(timeIntervalMins, maxStorage) {
        this.timeIntervalMs = timeIntervalMins * 60 * 1000;
        this.transactionMap = {};
        this.maxStorage = maxStorage;
    }
    FailureCounter.prototype.failure = function (protocol, txHash, blockTimestamp) {
        var _this = this;
        // if transactions array does not exist, initialize it
        if (!this.transactionMap[protocol]) {
            this.transactionMap[protocol] = [];
        }
        var blockTimestampMs = blockTimestamp * 1000; //convert seconds to ms
        // append transaction
        this.transactionMap[protocol].push({
            hash: txHash,
            timestamp: blockTimestampMs
        });
        // filter out any transactions that fall outside of the time interval
        this.transactionMap[protocol] = this.transactionMap[protocol].filter(function (txn) { return txn.timestamp > blockTimestampMs - _this.timeIntervalMs; });
        while (this.transactionMap[protocol].length > this.maxStorage)
            this.transactionMap[protocol].shift();
        return this.transactionMap[protocol].length;
    };
    FailureCounter.prototype.getTransactions = function (protocol) {
        return this.transactionMap[protocol]
            ? this.transactionMap[protocol].map(function (txn) { return txn.hash; })
            : [];
    };
    return FailureCounter;
}());
exports.default = FailureCounter;
