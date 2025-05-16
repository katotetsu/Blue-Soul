"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateVotesHttp = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
exports.aggregateVotesHttp = functions.https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const chargeRef = db.doc('chantCharge');
    const chargeSnap = await chargeRef.get();
    const chargeData = chargeSnap.data();
    if (!(chargeData === null || chargeData === void 0 ? void 0 : chargeData.active)) {
        res.status(200).send('Not active');
        return;
    }
    const now = admin.firestore.Timestamp.now();
    const thirtySecondsAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 30000);
    const votesSnap = await db.collection('votes')
        .where('votedAt', '>=', thirtySecondsAgo)
        .get();
    const voteCounts = {};
    votesSnap.forEach((doc) => {
        const chantId = doc.data().chantId;
        voteCounts[chantId] = (voteCounts[chantId] || 0) + 1;
    });
    const sorted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
    const [topChantId, count] = sorted[0] || [];
    if (count >= 3) {
        await db.doc('currentChant').set({
            chantId: topChantId,
            voteCount: count,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(200).send(`Updated to ${topChantId}`);
    }
    else {
        res.status(200).send('Insufficient votes');
    }
});
//# sourceMappingURL=index.js.map