import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  increment,
  deleteDoc,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/* 🔐 Firebase config from ENV */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/* 🔥 Initialize Firebase */
const app = initializeApp(firebaseConfig);

/* 🔥 Services */
export const db = getFirestore(app);
export const auth = getAuth(app);

/* ============================
   Firestore Helper Functions
=============================== */
export const firestoreHelpers = {
  getProducts: async (isSoldOut: boolean | null = null) => {
    const coll = collection(db, 'products');
    let q = query(coll, orderBy('createdAt', 'desc'));

    if (isSoldOut !== null) {
      q = query(
        coll,
        where('isSoldOut', '==', isSoldOut),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as object),
    }));
  },

  getProduct: async (id: string) => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        viewsCount: increment(1),
      });

      return {
        id: docSnap.id,
        ...(docSnap.data() as object),
      };
    }
    return null;
  },

  incrementWhatsApp: async (id: string) => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      whatsappClicks: increment(1),
    });
  },

  addProduct: async (data: any) => {
    return await addDoc(collection(db, 'products'), {
      ...data,
      createdAt: Date.now(),
      viewsCount: 0,
      whatsappClicks: 0,
      isSoldOut: false,
    });
  },

  updateProduct: async (id: string, data: any) => {
    return await updateDoc(doc(db, 'products', id), data);
  },

  deleteProduct: async (id: string) => {
    return await deleteDoc(doc(db, 'products', id));
  },

  /* 🔧 Global Settings */
  getSettings: async () => {
    const docRef = doc(db, 'settings', 'global');
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : { buy2get1Enabled: true };
  },

  updateSettings: async (data: any) => {
    return await setDoc(doc(db, 'settings', 'global'), data, {
      merge: true,
    });
  },

  /* 🎟 Coupons */
  getCoupons: async () => {
    const snap = await getDocs(collection(db, 'coupons'));
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
  },

  addCoupon: async (data: any) => {
    return await addDoc(collection(db, 'coupons'), data);
  },

  toggleCoupon: async (id: string, active: boolean) => {
    return await updateDoc(doc(db, 'coupons', id), {
      isActive: active,
    });
  },
};
