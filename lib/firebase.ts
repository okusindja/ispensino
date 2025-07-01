import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAE5SCxvX6JS5TSWXGqp8g5-muF_wj4LOo',
  authDomain: 'ispensino.firebaseapp.com',
  projectId: 'ispensino',
  storageBucket: 'ispensino.firebasestorage.app',
  messagingSenderId: '380756592347',
  appId: '1:380756592347:web:23d9d4ad0c93d3ce126efe',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
