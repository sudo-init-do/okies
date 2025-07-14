// src/firestore/firebase.service.ts

import { Injectable } from '@nestjs/common';
import {
  getFirestore,
  Firestore,
  DocumentData,
  WithFieldValue,
  DocumentReference,
} from 'firebase-admin/firestore';
import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  public db: Firestore;

  constructor() {
    // ─── Initialize Firebase Admin (only once) ─────────────────────────────────
    if (!getApps().length) {
      // 1) Grab the raw JSON string from the env var
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      if (!raw) {
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set',
        );
      }

      // 2) If your platform escaped newlines as "\\n", restore them
      const withNewlines = raw.replace(/\\n/g, '\n');

      // 3) Parse it into a ServiceAccount object
      let serviceAccount: ServiceAccount;
      try {
        serviceAccount = JSON.parse(withNewlines);
      } catch (err) {
        throw new Error(
          'Invalid JSON in FIREBASE_SERVICE_ACCOUNT_JSON: ' +
            (err as Error).message,
        );
      }

      // 4) Initialize the Admin SDK
      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    // ─── Firestore Client & Settings ───────────────────────────────────────────
    this.db = getFirestore();

    // Optional: ignore undefined properties on writes
    try {
      this.db.settings({ ignoreUndefinedProperties: true });
    } catch {
      /* already set or unsupported, safe to ignore */
    }
  }

  // ─── Basic CRUD ─────────────────────────────────────────────────────────────

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
    const ref = await this.db.collection(collection).add(data);
    return ref.id;
  }

  async getDocument<T extends DocumentData>(
    collection: string,
    docId: string,
  ): Promise<T | null> {
    if (!docId?.trim()) return null;
    const snap = await this.db.collection(collection).doc(docId).get();
    return snap.exists ? (snap.data() as T) : null;
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

  // ─── Sub-collections & Queries ─────────────────────────────────────────────

  async setSubDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    subcollection: string,
    subId: string,
    data: WithFieldValue<T>,
  ): Promise<void> {
    await this.db
      .collection(collection)
      .doc(docId)
      .collection(subcollection)
      .doc(subId)
      .set(data, { merge: true });
  }

  async deleteSubDocument(
    collection: string,
    docId: string,
    subcollection: string,
    subId: string,
  ): Promise<void> {
    await this.db
      .collection(collection)
      .doc(docId)
      .collection(subcollection)
      .doc(subId)
      .delete();
  }

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
