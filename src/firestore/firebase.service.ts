// src/firestore/firebase.service.ts

import { Injectable } from '@nestjs/common';
import {
  getFirestore,
  Firestore,
  DocumentData,
  WithFieldValue,
  DocumentReference,
} from 'firebase-admin/firestore';
import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  public db: Firestore;

  constructor() {
    // Initialize Firebase only once
    if (!getApps().length) {
      const projectId   = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !rawKey) {
        throw new Error(
          'One of FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is not set'
        );
      }

      // Turn the literal "\n" sequences back into real newlines
      const privateKey = rawKey.replace(/\\n/g, '\n');

      const serviceAccount: ServiceAccount = {
        projectId,
        clientEmail,
        privateKey,
      };

      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    // Initialize Firestore client
    this.db = getFirestore();
    try {
      this.db.settings({ ignoreUndefinedProperties: true });
    } catch {
      // settings already applied
    }
  }

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
      .doc(collection)
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
