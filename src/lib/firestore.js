import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── User Profile ───
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  return updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

export async function getUserByUsername(username) {
  const q = query(collection(db, "users"), where("username", "==", username), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// ─── Search ───
export async function searchUsers(searchTerm) {
  const q = query(
    collection(db, "users"),
    where("username", ">=", searchTerm.toLowerCase()),
    where("username", "<=", searchTerm.toLowerCase() + "\uf8ff"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Saved Cards ───
export async function saveCard(uid, targetUid) {
  return updateDoc(doc(db, "users", uid), {
    savedUsers: arrayUnion(targetUid),
  });
}

export async function unsaveCard(uid, targetUid) {
  return updateDoc(doc(db, "users", uid), {
    savedUsers: arrayRemove(targetUid),
  });
}

// ─── Recently Viewed ───
export async function addRecentlyViewed(uid, targetUid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return;
  let recent = userDoc.data().recentlyViewed || [];
  recent = recent.filter((id) => id !== targetUid);
  recent.unshift(targetUid);
  if (recent.length > 20) recent = recent.slice(0, 20);
  return updateDoc(doc(db, "users", uid), { recentlyViewed: recent });
}

// ─── Analytics ───
export async function incrementProfileViews(uid) {
  return updateDoc(doc(db, "users", uid), {
    "analytics.views": increment(1),
  });
}

export async function incrementQRScans(uid) {
  return updateDoc(doc(db, "users", uid), {
    "analytics.scans": increment(1),
  });
}

export async function incrementLinkClicks(uid) {
  return updateDoc(doc(db, "users", uid), {
    "analytics.linkClicks": increment(1),
  });
}

// ─── Scan History ───
export async function addScanHistory(uid, scannedUid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return;
  let history = userDoc.data().scanHistory || [];
  history.unshift({ uid: scannedUid, timestamp: new Date().toISOString() });
  if (history.length > 50) history = history.slice(0, 50);
  return updateDoc(doc(db, "users", uid), { scanHistory: history });
}

// ─── Discover / Trending ───
export async function getDiscoverProfiles(limitCount = 12) {
  const q = query(
    collection(db, "users"),
    where("settings.profileVisibility", "==", "public"),
    orderBy("analytics.views", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Temporary Sharing ───
export async function createTemporaryShare(uid, expiresInMinutes = 30) {
  const shareId = Math.random().toString(36).substring(2, 10);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  await setDoc(doc(db, "temporaryShares", shareId), {
    uid,
    expiresAt: expiresAt.toISOString(),
    createdAt: serverTimestamp(),
  });
  return { shareId, expiresAt };
}

export async function getTemporaryShare(shareId) {
  const snap = await getDoc(doc(db, "temporaryShares", shareId));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (new Date(data.expiresAt) < new Date()) {
    await deleteDoc(doc(db, "temporaryShares", shareId));
    return null;
  }
  return data;
}

// ─── Admin ───
export async function getAllUsers(limitCount = 50) {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
