import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../config/firebase-service-account.json';

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
}
const db = getFirestore();

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
  console.log('Seeding bot posts…');
  for (let i = 1; i <= 10; i++) {
    const uid = `bot_00${i}`;
    for (let j = 0; j < 3; j++) {
      const media =
        mediaSamples[Math.floor(Math.random() * mediaSamples.length)];
      await db.collection('posts').add({
        uid,
        caption: captions[Math.floor(Math.random() * captions.length)],
        mediaUrl: media.url,
        contentType: media.type,
        createdAt: new Date().toISOString(),
      });
    }
  }
  console.log('✅ Done seeding posts.');
  process.exit(0);
}
seed().catch((err) => {
  console.error('Error seeding bot posts:', err);
  process.exit(1);
});
