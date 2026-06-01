import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator, type Functions } from 'firebase/functions'
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
const region = import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1'
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true'

// Firebase is optional for local viewing: if no project id is configured, the app
// falls back to bundled data and a disabled chat, so `yarn dev` works out of the box.
export const firebaseEnabled = Boolean(cfg.projectId)

let app: FirebaseApp | undefined
let _db: Firestore | undefined
let _functions: Functions | undefined
let _storage: FirebaseStorage | undefined

if (firebaseEnabled) {
  app = initializeApp(cfg)
  _db = getFirestore(app)
  _functions = getFunctions(app, region)
  _storage = getStorage(app)
  if (useEmulators) {
    connectFirestoreEmulator(_db, 'localhost', 8080)
    connectFunctionsEmulator(_functions, 'localhost', 5001)
    connectStorageEmulator(_storage, 'localhost', 9199)
  }
}

export const db = _db
export const functions = _functions
export const storage = _storage
