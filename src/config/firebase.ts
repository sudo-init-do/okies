// src/config/firebase.ts
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON env var is not defined');
}

let serviceAccount: ServiceAccount;
try {
  serviceAccount = JSON.parse(raw);
} catch (e) {
  throw new Error(`Invalid JSON in FIREBASE_SERVICE_ACCOUNT_JSON: ${(e as Error).message}`);
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export { db };
