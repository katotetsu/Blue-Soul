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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentChant = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
exports.updateCurrentChant = (0, scheduler_1.onSchedule)({ schedule: "* * * * *", timeZone: "Asia/Tokyo", region: "asia-northeast1" }, async (_event) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    const oneMinuteAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 60000);
    try {
        logger.info("Starting vote aggregation (last 1 minute)...");
        // 前1分間のvotesのみ集計
        const votesSnap = await db.collection('votes')
            .where('votedAt', '>=', oneMinuteAgo)
            .get();
        logger.info(`Fetched ${votesSnap.size} vote(s) from the last 1 minute`);
        const voteCounts = {};
        votesSnap.forEach((doc) => {
            const rawChantId = doc.data().chantId;
            const chantId = typeof rawChantId === 'string' ? rawChantId.trim() : String(rawChantId);
            if (chantId) {
                voteCounts[chantId] = (voteCounts[chantId] || 0) + 1;
            }
        });
        logger.info(`Vote counts: ${JSON.stringify(voteCounts)}`);
        if (Object.keys(voteCounts).length === 0) {
            logger.info("No valid votes in the last minute.");
            return;
        }
        const sortedChantIds = Object.entries(voteCounts)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        for (const [chantId, maxVotes] of sortedChantIds) {
            const chantDoc = await db.collection('chants').doc(chantId).get();
            if (chantDoc.exists) {
                const chantData = chantDoc.data();
                // currentChantコレクションにpush型で追加
                await db.collection('currentChant').add({
                    chantId,
                    name: (chantData === null || chantData === void 0 ? void 0 : chantData.name) || '',
                    lyrics: (chantData === null || chantData === void 0 ? void 0 : chantData.lyrics) || '',
                    tags: (chantData === null || chantData === void 0 ? void 0 : chantData.tags) || [],
                    voteCount: maxVotes,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                logger.info(`Added current chant to currentChant collection: ${chantId}`);
                return;
            }
            logger.warn(`Chant with ID ${chantId} not found, skipping...`);
        }
        logger.error('No valid chantId found in votes.');
    }
    catch (error) {
        logger.error('Error updating current chant:', error);
    }
});
//# sourceMappingURL=index.js.map