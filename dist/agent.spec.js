"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var forta_agent_1 = require("forta-agent");
var failure_counter_1 = __importDefault(require("./failure.counter"));
var agent_1 = __importStar(require("./agent"));
var testAddresses = ["0x1", "0x2", "0x3"];
var createTxEvent = function (_a) {
    var status = _a.status, hash = _a.hash, timestamp = _a.timestamp, addresses = _a.addresses;
    var tx = { hash: hash };
    var receipt = { status: status };
    var block = { timestamp: timestamp };
    return new forta_agent_1.TransactionEvent(forta_agent_1.EventType.BLOCK, forta_agent_1.Network.MAINNET, tx, receipt, [], addresses, block);
};
var createTestFinding = function (addr, txns, threshold) {
    while (txns.length > threshold)
        txns.shift();
    return (0, agent_1.createFinding)(addr, txns);
};
var provideHandleTransaction = function (interval, threshold) {
    return agent_1.default.provideHandleTransaction(new failure_counter_1.default(interval, threshold), testAddresses);
};
var txGenerator = function (amount, addresses, start, status) {
    if (start === void 0) { start = 0; }
    if (status === void 0) { status = false; }
    var txns = [];
    var _loop_1 = function (i) {
        var event_1 = {
            status: status,
            hash: "0x".concat(i),
            timestamp: i + start,
            addresses: {}
        };
        addresses.forEach(function (addr) { return (event_1.addresses[addr] = true); });
        txns.push(createTxEvent(event_1));
    };
    for (var i = 0; i < amount; ++i) {
        _loop_1(i);
    }
    return txns;
};
describe("High volume of failed txs agent test suit", function () {
    var handleTransaction;
    var threshold = agent_1.HIGH_FAILURE_THRESHOLD + 10;
    beforeEach(function () {
        handleTransaction = provideHandleTransaction(10, threshold);
    });
    describe("handleTransaction", function () {
        it("Should report 0 findings if transactions are under the threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
            var txns, i, findings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txns = txGenerator(agent_1.HIGH_FAILURE_THRESHOLD, testAddresses);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < txns.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, handleTransaction(txns[i])];
                    case 2:
                        findings = _a.sent();
                        expect(findings).toStrictEqual([]);
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        describe("Handle an amount of transactions greater than the threshold", function () {
            var addr1hashes;
            var addr2hashes;
            var findings;
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                var txns, i, txnAddr1And2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            addr1hashes = [];
                            addr2hashes = [];
                            txns = txGenerator(agent_1.HIGH_FAILURE_THRESHOLD - 1, testAddresses);
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < txns.length)) return [3 /*break*/, 4];
                            addr1hashes.push(txns[i].hash);
                            addr2hashes.push(txns[i].hash);
                            return [4 /*yield*/, handleTransaction(txns[i])];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4:
                            txnAddr1And2 = createTxEvent({
                                status: false,
                                hash: "0xA",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD,
                                addresses: {
                                    "0x1": true,
                                    "0x2": true
                                }
                            });
                            addr1hashes.push("0xA");
                            addr2hashes.push("0xA");
                            return [4 /*yield*/, handleTransaction(txnAddr1And2)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should report findings for each address that execed the threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txnAddr1, txnAddr2, txnAddr3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            txnAddr1 = createTxEvent({
                                status: false,
                                hash: "0xA1",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD + 1,
                                addresses: {
                                    "0x1": true
                                }
                            });
                            addr1hashes.push("0xA1");
                            return [4 /*yield*/, handleTransaction(txnAddr1)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([
                                createTestFinding("0x1", addr1hashes, threshold)
                            ]);
                            txnAddr2 = createTxEvent({
                                status: false,
                                hash: "0xA2",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD + 2,
                                addresses: {
                                    "0x2": true
                                }
                            });
                            addr2hashes.push("0xA2");
                            return [4 /*yield*/, handleTransaction(txnAddr2)];
                        case 2:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([
                                createTestFinding("0x2", addr2hashes, threshold)
                            ]);
                            txnAddr3 = createTxEvent({
                                status: false,
                                hash: "0xA3",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD + 3,
                                addresses: {
                                    "0x3": true
                                }
                            });
                            return [4 /*yield*/, handleTransaction(txnAddr3)];
                        case 3:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should report multiple findings", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txnAddr1And2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            txnAddr1And2 = createTxEvent({
                                status: false,
                                hash: "0xAB",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD + 1,
                                addresses: {
                                    "0x1": true,
                                    "0x2": true
                                }
                            });
                            addr1hashes.push("0xAB");
                            addr2hashes.push("0xAB");
                            return [4 /*yield*/, handleTransaction(txnAddr1And2)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([
                                createTestFinding("0x1", addr1hashes, threshold),
                                createTestFinding("0x2", addr2hashes, threshold)
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should ignore successful transactions", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txns, i, findings_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            txns = txGenerator(agent_1.HIGH_FAILURE_THRESHOLD, testAddresses, agent_1.HIGH_FAILURE_THRESHOLD + 1, true);
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < txns.length)) return [3 /*break*/, 4];
                            addr1hashes.push(txns[i].hash);
                            addr2hashes.push(txns[i].hash);
                            return [4 /*yield*/, handleTransaction(txns[i])];
                        case 2:
                            findings_1 = _a.sent();
                            expect(findings_1).toStrictEqual([]);
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            it("Should ignore successful transactions and keep the failed ones", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txnAddr1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            txnAddr1 = createTxEvent({
                                status: true,
                                hash: "0xA1",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD + 1,
                                addresses: {
                                    "0x1": true
                                }
                            });
                            return [4 /*yield*/, handleTransaction(txnAddr1)];
                        case 1:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([]);
                            txnAddr1 = createTxEvent({
                                status: false,
                                hash: "0xA2",
                                timestamp: agent_1.HIGH_FAILURE_THRESHOLD + 2,
                                addresses: {
                                    "0x1": true
                                }
                            });
                            addr1hashes.push("0xA2");
                            return [4 /*yield*/, handleTransaction(txnAddr1)];
                        case 2:
                            findings = _a.sent();
                            expect(findings).toStrictEqual([
                                createTestFinding("0x1", addr1hashes, threshold)
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should drop old transactions", function () { return __awaiter(void 0, void 0, void 0, function () {
                var txns, i, findings_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            txns = txGenerator(agent_1.HIGH_FAILURE_THRESHOLD, testAddresses, agent_1.TIME_INTERVAL * 60);
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < txns.length)) return [3 /*break*/, 4];
                            return [4 /*yield*/, handleTransaction(txns[i])];
                        case 2:
                            findings_2 = _a.sent();
                            expect(findings_2).toStrictEqual([]);
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            it("Should report the amount of failed transactions", function () { return __awaiter(void 0, void 0, void 0, function () {
                var amountTxn, txns, i, findings_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            amountTxn = 200;
                            txns = txGenerator(amountTxn, ["0x1"], agent_1.HIGH_FAILURE_THRESHOLD + 1);
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < amountTxn)) return [3 /*break*/, 4];
                            addr1hashes.push(txns[i].hash);
                            return [4 /*yield*/, handleTransaction(txns[i])];
                        case 2:
                            findings_3 = _a.sent();
                            expect(findings_3).toStrictEqual([
                                createTestFinding("0x1", addr1hashes, threshold)
                            ]);
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
