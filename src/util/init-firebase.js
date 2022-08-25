import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBqlv-SrV2UoI-Y2wKbr4XZjExImx2S_as",
  authDomain: "drawing-dash-41f14.firebaseapp.com",
  databaseURL: "https://drawing-dash-41f14-default-rtdb.firebaseio.com",
  projectId: "drawing-dash-41f14",
  storageBucket: "drawing-dash-41f14.appspot.com",
  messagingSenderId: "690834170486",
  appId: "1:690834170486:web:d39a963d23640ce1423557",
  measurementId: "G-X58G74ZLMV",
};

const app = initializeApp(firebaseConfig);

export { app };
