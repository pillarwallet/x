import { initializeApp } from '@firebase/app';
import { getAnalytics} from '@firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBqsmAxGY1Xpqlt9xAb3OzMaJdOO_QUZ3w",
  authDomain: "pillarx-76235.firebaseapp.com",
  projectId: "pillarx-76235",
  storageBucket: "pillarx-76235.appspot.com",
  messagingSenderId: "924594360100",
  appId: "1:924594360100:web:9075123e56081d30662db1",
  measurementId: "G-RQ0CLNGRGV"
};

const app = initializeApp(firebaseConfig);

export const firebaseAnalytics = getAnalytics(app);
