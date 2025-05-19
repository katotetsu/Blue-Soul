import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

export const updateCurrentChant = onSchedule(
  { schedule: "* * * * *", timeZone: "Asia/Tokyo", region: "asia-northeast1" },
  async (_event: unknown) => {
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

      const voteCounts: Record<string, number> = {};
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
            name: chantData?.name || '',
            lyrics: chantData?.lyrics || '',
            tags: chantData?.tags || [],
            voteCount: maxVotes,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          logger.info(`Added current chant to currentChant collection: ${chantId}`);
          return;
        }
        logger.warn(`Chant with ID ${chantId} not found, skipping...`);
      }

      logger.error('No valid chantId found in votes.');
    } catch (error) {
      logger.error('Error updating current chant:', error);
    }
  }
);
