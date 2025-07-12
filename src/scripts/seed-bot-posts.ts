// src/scripts/seed-bot-posts.ts

import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const captions = [
  'First post!',
  'Love this view',
  'Check this out',
  '😂😂😂',
  'Daily vibes',
];
const mediaSamples = [
  { url: 'https://placehold.co/600x800.mp4', type: 'video/mp4' },
  { url: 'https://placehold.co/600x800.jpg', type: 'image/jpeg' },
];

async function seed() {
  // 1) Load & parse service account JSON from env
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

  // 2) Initialize Firebase Admin once
  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  const db = getFirestore();

  console.log('🚀 Seeding bot posts…');
  for (let i = 1; i <= 10; i++) {
    const uid = `bot_00${i}`;
    for (let j = 0; j < 3; j++) {
      const media = mediaSamples[Math.floor(Math.random() * mediaSamples.length)];
      const caption = captions[Math.floor(Math.random() * captions.length)];
      await db.collection('posts').add({
        uid,
        caption,
        mediaUrl: media.url,
        contentType: media.type,
        createdAt: new Date().toISOString(),
      });
      console.log(`  • ${uid} posted “${caption}”`);
    }
  }
  console.log('✅ Done seeding posts.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error seeding bot posts:', err);
  process.exit(1);
});
