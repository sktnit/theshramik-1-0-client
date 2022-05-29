// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  sendEmailVerification
} from "firebase/auth"
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN_NAME,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET_NAME,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, "users"), where("uid", "==", user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      })
    }
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
}

const registerWithEmailAndPassword = async (name, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  console.log('res==>', res)
  await sendEmailVerification(auth.currentUser)
  // const user = res.user
  // await addDoc(collection(db, "users"), {
  //   uid: user.uid,
  //   name,
  //   authProvider: "local",
  //   email,
  // })

}

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    alert("Password reset link sent!")
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}
const resendEmailVerificationLink = async () => {
  try {
    await sendEmailVerification(auth.currentUser)
    alert("Verification link sent!")
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const logout = () => {
  signOut(auth)
}

const signInWithPhone = async (mynumber) => {
  if (mynumber === "" || mynumber.length < 10) return
  let verify = new RecaptchaVerifier('recaptcha-container')
  await signInWithPhoneNumber(mynumber, verify)
  // .then((result) => {
  //   // setfinal(result)
  //   alert("code sent")
  //   // setshow(true)
  // })
  // .catch((err) => {
  //   alert(err)
  //   window.location.reload()
  // })
}

// Validate OTP
const validateOtp = async (otp, enteredOtp) => {
  if (otp === null || enteredOtp === null)
    return
  try {
    await enteredOtp.confirm(otp)
  } catch (err) {
    console.log(err)
    alert("Wrong code")
  }
}

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  signInWithPhone,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  validateOtp,
  resendEmailVerificationLink
}