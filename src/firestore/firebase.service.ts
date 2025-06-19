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

import * as serviceAccount from 'src/config/firebase-service-account.json';

@Injectable()
export class FirebaseService {
  private db: Firestore;

  constructor() {
    // ✅ Initialize Firebase once using the service account credentials
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
      });
    }

    this.db = getFirestore();
  }

  async setDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: WithFieldValue<T>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).set(data, { merge: true });
  }

  async getDocument<T extends DocumentData>(
    collection: string,
    docId: string,
  ): Promise<T | null> {
    const docRef = this.db.collection(collection).doc(docId);
    const doc = await docRef.get();
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
}
