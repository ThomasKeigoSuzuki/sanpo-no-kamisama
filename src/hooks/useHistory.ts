import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from '../firebase';
import type { SanpoRecord } from '../types';

export function useHistory(userId: string | undefined) {
  const [records, setRecords] = useState<SanpoRecord[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userId || !isConfigured || !db) {
      setRecords([]);
      return;
    }

    const q = query(
      collection(db, 'sanpo_records'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: SanpoRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          where: data.where ?? null,
          what: data.what ?? null,
          memo: data.memo ?? '',
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        };
      });
      setRecords(items);
    }, (error) => {
      console.error('Firestore listen error:', error);
    });

    return () => unsubscribe();
  }, [userId]);

  const addRecord = async (data: {
    where: string | null;
    what: string | null;
    memo: string;
  }) => {
    if (!userId || !db) return;
    setUploading(true);
    try {
      await addDoc(collection(db, 'sanpo_records'), {
        userId,
        where: data.where,
        what: data.what,
        memo: data.memo,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Add record error:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'sanpo_records', id));
    } catch (error) {
      console.error('Delete record error:', error);
    }
  };

  return { records, addRecord, deleteRecord, uploading };
}
