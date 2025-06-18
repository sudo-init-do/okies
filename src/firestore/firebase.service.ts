// This service handles all interactions with Firestore using Firebase Admin SDK

import { Injectable } from '@nestjs/common';
import {
  getFirestore,
  DocumentData,
  Firestore,
  WithFieldValue,
  DocumentReference,
} from 'firebase-admin/firestore';
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  private db: Firestore;

  constructor() {
    // ✅ Ensure Firebase is initialized only once in the entire app lifecycle
    if (!getApps().length) {
      initializeApp({
        credential: applicationDefault(),
      });
    }

    // ✅ Connect to Firestore
    this.db = getFirestore();
  }

  // ✅ Set (create or merge) a document
  async setDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: WithFieldValue<T>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).set(data, { merge: true });
  }

  // ✅ Get a document by ID
  async getDocument<T extends DocumentData>(
    collection: string,
    docId: string,
  ): Promise<T | null> {
    const docRef = this.db.collection(collection).doc(docId);
    const doc = await docRef.get();
    return doc.exists ? (doc.data() as T) : null;
  }

  // ✅ Update specific fields of a document
  async updateDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: Partial<WithFieldValue<T>>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).update(data);
  }

  // ✅ Get a typed document reference
  getDocumentRef<T = DocumentData>(
    collection: string,
    docId: string,
  ): DocumentReference<T> {
    return this.db.collection(collection).doc(docId) as DocumentReference<T>;
  }
}
