// src/scripts/bot-runner.ts

import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as cron from 'node-cron';

interface BotUser {
  uid: string;
  displayName: string;
}

// ── Your 10 bot definitions ───────────────────────────────────────────
const bots: BotUser[] = [
  { uid: 'bot_001', displayName: 'OkiesStar1' },
  { uid: 'bot_002', displayName: 'OkiesGuru' },
  { uid: 'bot_003', displayName: 'VibeQueen' },
  { uid: 'bot_004', displayName: 'DanceWiz' },
  { uid: 'bot_005', displayName: 'SkitzCraze' },
  { uid: 'bot_006', displayName: 'HypeManX' },
  { uid: 'bot_007', displayName: 'TechByte' },
  { uid: 'bot_008', displayName: 'LensQueen' },
  { uid: 'bot_009', displayName: 'OkieVibes' },
  { uid: 'bot_010', displayName: 'MemeLord' },
];

// ── Your media pool ───────────────────────────────────────────────────
const mediaPool = [
  {
    url: 'https://<account>.r2.cloudflarestorage.com/<bucket>/sample1.mp4',
    type: 'video/mp4',
  },
  {
    url: 'https://<account>.r2.cloudflarestorage.com/<bucket>/sample2.jpg',
    type: 'image/jpeg',
  },
  {
    url: 'https://<account>.r2.cloudflarestorage.com/<bucket>/sample3.mp4',
    type: 'video/mp4',
  },
];

// ── Your caption list ─────────────────────────────────────────────────
const captions = [
  'First take 🔥',
  'Morning vibes ☀️',
  'What do you think?',
  '😂😂😂',
  'Weekend mood',
];

// pick a random element
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// lazy-init Firebase from JSON in env
function initFirebase() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON not set');
    }
    let sa: ServiceAccount;
    try {
      sa = JSON.parse(raw);
    } catch (err) {
      throw new Error(
        'Invalid FIREBASE_SERVICE_ACCOUNT_JSON: ' + (err as Error).message,
      );
    }
    initializeApp({ credential: cert(sa) });
  }
  return getFirestore();
}

async function postForBot(db: FirebaseFirestore.Firestore, bot: BotUser) {
  const media = randomItem(mediaPool);
  const caption = randomItem(captions);

  await db.collection('posts').add({
    uid: bot.uid,
    caption,
    mediaUrl: media.url,
    contentType: media.type,
    createdAt: new Date().toISOString(),
  });

  console.log(`• ${bot.displayName} posted: ${caption}`);
}

async function likeRandomPost(db: FirebaseFirestore.Firestore, bot: BotUser) {
  const snap = await db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
  if (snap.empty) return;

  const randomDoc = randomItem(snap.docs);
  await randomDoc.ref.collection('likes').doc(bot.uid).set({
    uid: bot.uid,
    createdAt: FieldValue.serverTimestamp(),
  });
  console.log(`♥ ${bot.displayName} liked post ${randomDoc.id}`);
}

async function runOnce() {
  const db = initFirebase();
  const bot = randomItem(bots);

  if (Math.random() < 0.7) {
    await postForBot(db, bot);
  } else {
    await likeRandomPost(db, bot);
  }
}

// ─────────────────────────────────────────────────────────────────────
// ENTRY POINTS
// ─────────────────────────────────────────────────────────────────────

// single run: `npm run bot:once`
if (process.argv.includes('--once')) {
  runOnce()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Bot run failed:', err);
      process.exit(1);
    });
}

// cron loop: `npm run bot:loop`
if (process.argv.includes('--loop')) {
  cron.schedule('*/10 * * * *', () => {
    runOnce().catch((err) => console.error('Cron error:', err));
  });
  console.log('🤖 Bot loop started — posting/liking every 10 min');
}
