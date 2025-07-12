// src/scripts/seed-bots.ts

import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

interface BotUser {
  uid: string;
  displayName: string;
  avatar: string;
  bio: string;
}

const bots: BotUser[] = [
  {
    uid: 'bot_001',
    displayName: 'OkiesStar1',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Just vibing on Okies 🎥',
  },
  {
    uid: 'bot_002',
    displayName: 'OkiesGuru',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Master of memes.',
  },
  {
    uid: 'bot_003',
    displayName: 'VibeQueen',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Let’s make some noise!',
  },
  {
    uid: 'bot_004',
    displayName: 'DanceWiz',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Catch me dancing 💃',
  },
  {
    uid: 'bot_005',
    displayName: 'SkitzCraze',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Comedy is life.',
  },
  {
    uid: 'bot_006',
    displayName: 'HypeManX',
    avatar: 'https://i.pravatar.cc/150?img=6',
    bio: 'Here to hype!',
  },
  {
    uid: 'bot_007',
    displayName: 'TechByte',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: 'Bots love tech.',
  },
  {
    uid: 'bot_008',
    displayName: 'LensQueen',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'My camera, my story.',
  },
  {
    uid: 'bot_009',
    displayName: 'OkieVibes',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Bringing positive vibes!',
  },
  {
    uid: 'bot_010',
    displayName: 'MemeLord',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'Daily dose of laughter 😂',
  },
];

async function seedBots() {
  // 1) Load and parse your service account JSON from env
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    process.exit(1);
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error('❌ Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', (err as Error).message);
    process.exit(1);
  }

  // 2) Initialize Firebase Admin SDK once
  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  const db = getFirestore();

  console.log('🚀  Seeding bot users …');

  for (const bot of bots) {
    await db
      .collection('users')
      .doc(bot.uid)
      .set(
        {
          uid: bot.uid,
          displayName: bot.displayName,
          avatar: bot.avatar,
          bio: bot.bio,
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      );
    console.log(`  • Seeded ${bot.displayName} (${bot.uid})`);
  }

  console.log('✅  Bot seeding complete.');
  process.exit(0);
}

seedBots().catch((err) => {
  console.error('❌  Bot seeding failed:', err);
  process.exit(1);
});
