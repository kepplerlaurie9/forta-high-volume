"use strict";
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
exports.createFinding = exports.INTERSTING_PROTOCOLS = exports.TIME_INTERVAL = exports.HIGH_FAILURE_THRESHOLD = void 0;
var forta_agent_1 = require("forta-agent");
var failure_counter_1 = __importDefault(require("./failure.counter"));
exports.HIGH_FAILURE_THRESHOLD = 50;
exports.TIME_INTERVAL = 60; // 1 hour
exports.INTERSTING_PROTOCOLS = [
    "0xacd43e627e64355f1861cec6d3a6688b31a6f952",
    "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b",
    "0x11111112542D85B3EF69AE05771c2dCCff4fAa26",
    "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77",
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    "0xa5409ec958C83C3f309868babACA7c86DCB077c1",
    "0x3845badAde8e6dFF049820680d1F14bD3903a5d0" // The Sandbox Token
];
var failureCounter = new failure_counter_1.default(exports.TIME_INTERVAL, exports.HIGH_FAILURE_THRESHOLD + 5);
var createFinding = function (addr, txns) {
    return forta_agent_1.Finding.fromObject({
        name: "High Volume of Failed Txn Detection",
        description: "High Volume of Failed Transactions are detected.",
        alertId: "NETHFORTA-3",
        type: forta_agent_1.FindingType.Suspicious,
        severity: forta_agent_1.FindingSeverity.High,
        metadata: {
            count: txns.length.toString(),
            address: addr,
            transactions: JSON.stringify(txns)
        }
    });
};
exports.createFinding = createFinding;
function provideHandleTransaction(counter, protocols) {
    return function handleTransaction(txEvent) {
        return __awaiter(this, void 0, void 0, function () {
            var findings, involvedProtocols;
            return __generator(this, function (_a) {
                findings = [];
                if (txEvent.status !== false)
                    return [2 /*return*/, findings];
                involvedProtocols = protocols.filter(function (addr) { return txEvent.addresses[addr.toLowerCase()]; });
                involvedProtocols.forEach(function (addr) {
                    var amount = counter.failure(addr, txEvent.hash, txEvent.timestamp);
                    if (amount > exports.HIGH_FAILURE_THRESHOLD) {
                        findings.push((0, exports.createFinding)(addr, counter.getTransactions(addr)));
                    }
                });
                return [2 /*return*/, findings];
            });
        });
    };
}
exports.default = {
    provideHandleTransaction: provideHandleTransaction,
    handleTransaction: provideHandleTransaction(failureCounter, exports.INTERSTING_PROTOCOLS)
};
