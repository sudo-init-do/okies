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
    // ─── Only initialize the Admin SDK once ─────────────────────────────────
    if (!getApps().length) {
      // 1) Read the JSON blob from env
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      if (!raw) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON env var is not set');
      }

      // 2) Parse it into an object
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        throw new Error(
          'Invalid JSON in FIREBASE_SERVICE_ACCOUNT_JSON: ' +
            (err as Error).message
        );
      }

      // 3) Map into ServiceAccount shape, un-escaping "\n"
      const serviceAccount: ServiceAccount = {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key.replace(/\\n/g, '\n'),
      };

      // 4) Initialize the Admin SDK
      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    // ─── Wire up Firestore & settings ────────────────────────────────────────
    this.db = getFirestore();
    try {
      this.db.settings({ ignoreUndefinedProperties: true });
    } catch {
      /* ignore if already applied or not supported */
    }
  }

  /** Basic CRUD **/
  async setDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: WithFieldValue<T>
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).set(data, { merge: true });
  }

  async addDocument<T extends DocumentData>(
    collection: string,
    data: WithFieldValue<T>
  ): Promise<string> {
    const ref = await this.db.collection(collection).add(data);
    return ref.id;
  }

  async getDocument<T extends DocumentData>(
    collection: string,
    docId: string
  ): Promise<T | null> {
    if (!docId?.trim()) return null;
    const snap = await this.db.collection(collection).doc(docId).get();
    return snap.exists ? (snap.data() as T) : null;
  }

  async updateDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    data: Partial<WithFieldValue<T>>
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).update(data);
  }

  getDocumentRef<T = DocumentData>(
    collection: string,
    docId: string
  ): DocumentReference<T> {
    return this.db.collection(collection).doc(docId) as DocumentReference<T>;
  }

  /** Sub-collections **/
  async setSubDocument<T extends DocumentData>(
    collection: string,
    docId: string,
    subcollection: string,
    subId: string,
    data: WithFieldValue<T>
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
    subId: string
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
    value: string
  ): Promise<T[]> {
    const snap = await this.db
      .collection(collection)
      .where(field, '==', value)
      .get();
    return snap.docs.map((d) => d.data() as T);
  }
}
