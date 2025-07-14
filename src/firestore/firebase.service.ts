// src/firestore/firebase.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  getFirestore,
  Firestore,
  DocumentData,
  WithFieldValue,
  DocumentReference,
} from 'firebase-admin/firestore';
import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public db!: Firestore;

  onModuleInit() {
    // Only initialize the Admin SDK once
    if (!getApps().length) {
      // 1) Read the Base64 string from env
      const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
      if (!b64) {
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT_B64 environment variable is not set',
        );
      }

      // 2) Decode from Base64 to UTF-8 JSON text
      let jsonText: string;
      try {
        jsonText = Buffer.from(b64, 'base64').toString('utf-8');
      } catch (err) {
        throw new Error(
          'Failed to Base64-decode FIREBASE_SERVICE_ACCOUNT_B64: ' +
            (err as Error).message,
        );
      }

      // 3) Parse JSON
      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        throw new Error(
          'Invalid JSON in decoded FIREBASE_SERVICE_ACCOUNT_B64: ' +
            (err as Error).message,
        );
      }

      // 4) Map into ServiceAccount
      const serviceAccount: ServiceAccount = {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key.replace(/\\n/g, '\n'),
      };

      // 5) Initialize the Admin SDK
      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    // Wire up Firestore client
    this.db = getFirestore();
    try {
      this.db.settings({ ignoreUndefinedProperties: true });
    } catch {
      /* ignore if not supported */
    }
  }

  /** Basic CRUD **/

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

  /** Sub-collections **/

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
