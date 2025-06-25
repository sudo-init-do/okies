// src/firestore/firebase.service.ts
import { Injectable } from '@nestjs/common';
import {
  getFirestore,
  DocumentData,
  Firestore,
  WithFieldValue,
  DocumentReference,
} from 'firebase-admin/firestore';
import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';

// Adjust the import path to your JSON location
import serviceAccount from '../config/firebase-service-account.json';

@Injectable()
export class FirebaseService {
  private db: Firestore;

  constructor() {
    // Initialize Admin SDK once
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
      });
    }
    this.db = getFirestore();
  }

  /* ---------- Basic CRUD helpers ---------- */

  async setDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: WithFieldValue<T>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).set(data, { merge: true });
  }

  async addDocument<T extends DocumentData>(
    collection: string,
    data: WithFieldValue<T>,
  ): Promise<string> {
    const docRef = await this.db.collection(collection).add(data);
    return docRef.id; // returns generated doc ID
  }

  async getDocument<T extends DocumentData>(
    collection: string,
    docId: string,
  ): Promise<T | null> {
    const doc = await this.db.collection(collection).doc(docId).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async updateDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: Partial<WithFieldValue<T>>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).update(data);
  }

  getDocumentRef<T = DocumentData>(
    collection: string,
    docId: string,
  ): DocumentReference<T> {
    return this.db.collection(collection).doc(docId) as DocumentReference<T>;
  }

  /* ---------- New query helper for media listing ---------- */

  async queryCollectionByField<T extends DocumentData>(
    collection: string,
    field: string,
    value: string,
  ): Promise<T[]> {
    const snap = await this.db
      .collection(collection)
      .where(field, '==', value)
      .get();

    return snap.docs.map((d) => d.data() as T);
  }
}
