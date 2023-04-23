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
  getDoc,
  collection,
  doc,
  where,
  addDoc,
  updateDoc,
  setDoc,
  orderBy,
  startAt,
  startAfter,
  limit
} from "firebase/firestore"

import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage"

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

// get firestore to store data
const db = getFirestore(app)

// get file storage app
const storage = getStorage(app)

const googleProvider = new GoogleAuthProvider()

// sign in with google option
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, "User"), where("uid", "==", user.uid))
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
    console.error('SignInWithGoogleException', err)
  }
}

// sign in with login id and password
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.log('LogInWithEmailAndPassword', error)
  }
}

// register with email and password
const registerWithEmailAndPassword = async (name, email, password, role) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    if (user) {
      await writeUserData({
        uid: user.uid,
        name: name,
        authProvider: "locale",
        email: email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        createdAt: user.metadata && user.metadata.createdAt,
        role: role,
        active: false,
        verified: false
      })
    }
    await sendEmailVerification(auth.currentUser)
  } catch (error) {
    console.log('RegisterWithEmailAndPasswordException', error)
  }
}

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    console.log("Password reset link sent!")
  } catch (err) {
    console.log('SendPasswordResetException', err)
  }
}
const resendEmailVerificationLink = async () => {
  try {
    await sendEmailVerification(auth.currentUser)
    console.log("Verification link sent!")
  } catch (err) {
    console.log('ResendEmailVerificationLinkException', err)
    console.log(err.message)
  }
}

// start: register and sign in with phone
const generateRecaptcha = async (phoneNumber) => {
  return window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
      if (response) {
        return response
      } else {
        window.recaptchaVerifier.recaptcha.reset()
        window.recaptchaVerifier.clear()
        console.log('Invalid captcha verification.')
      }
    }
  }, auth)
}

// sign in with phone
const signInWithPhone = async (mynumber) => {
  if (mynumber === "" || mynumber.length < 10) return
  try {
    let appVerifier = await generateRecaptcha()
    let confirmationResult = await signInWithPhoneNumber(auth, mynumber, appVerifier)
    window.confirmationResult = confirmationResult
  } catch (error) {
    console.log('SignInWithPhoneException', error)
  }
}

// otp verification code
const verifyOTP = async (otp) => {
  try {
    let confirmationResult = window.confirmationResult
    let result = await confirmationResult.confirm(otp)
    const user = result.user
    if (user) {
      const userData = await getUserData(user.uid)
      if (!userData || !userData.data()) {
        await writeUserData({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          phoneVerified: true,
          createdAt: user.metadata && user.metadata.createdAt,
          active: false,
          verified: false
        })
      }
    }
  } catch (error) {
    console.log('VerifyOTPException', error)
    console.log("Wrong code")
  }
}
// end : register and sign in with phone

// logout
const logout = () => {
  signOut(auth)
}

// Validate OTP
const validateOtp = async (otp, enteredOtp) => {
  if (otp === null || enteredOtp === null)
    return
  try {
    await enteredOtp.confirm(otp)
  } catch (err) {
    console.log(err)
    console.log("Wrong code")
  }
}

async function writeUserData(user) {
  const collectionRef = collection(db, "User")
  return await setDoc(doc(collectionRef, user.uid), user)
}

async function getUserData(uid) {
  const collectionRef = collection(db, "User")
  return await getDoc(doc(collectionRef, uid))
}

async function updateUserData(docId, user) {
  const collectionRef = collection(db, "User")
  return await updateDoc(doc(collectionRef, docId), user)
}

const uploadProfilePic = async (uid, image, file) => {
  if (image && file && file.name) {
    const photoUrl = await uploadFile('images', image, file)
    if (photoUrl !== '') {
      await updateAuthProfile({ photoUrl: photoUrl })
      await updateUserData(uid, {
        profilePic: photoUrl
      })
    }
    return photoUrl
  }
}

const uploadFile = async (folder, image, file, key) => {
  const user = auth.currentUser
  if (user && image && file && file.name) {
    const fileExtension = file.name.split('.').pop()
    const imageRef = ref(storage, `${folder}/${user.uid}${key ? '_' + key : ''}.${fileExtension}`)
    const res = await uploadBytes(imageRef, image)
    let photoUrl = ''
    if (res) {
      photoUrl = await getDownloadURL(imageRef)
    }
    console.log('photoUrl==>', photoUrl)
    return photoUrl
  }
}

const updateAuthProfile = async (data) => {
  const user = auth.currentUser
  return await updateProfile(user, data)
}

async function updateData(tableName, docId, data) {
  const collectionRef = collection(db, tableName)
  return await updateDoc(doc(collectionRef, docId), data)
}

const getPaginatedData = async (...args) => {
  const [tableName, orderByArr, lastVisible, PAGE_SIZE] = args
  let constructArgs = []
  if (orderByArr && orderByArr.length > 0) {
    orderByArr.forEach(el => {
      constructArgs.push(orderBy(el.sortedBy, el.sortedOrder))
    })
  }
  if (lastVisible) {
    constructArgs.push(startAfter(lastVisible))
  }
  if (PAGE_SIZE) {
    constructArgs.push(limit(PAGE_SIZE))
  }
  const queryParams = query(collection(db, tableName), ...constructArgs);
  const querySnapshot = await getDocs(queryParams);
  return querySnapshot.size > 0 ? { data: querySnapshot, lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] } : {}
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
  resendEmailVerificationLink,
  generateRecaptcha,
  verifyOTP,
  updateUserData,
  updateData,
  getUserData,
  uploadProfilePic,
  uploadFile,
  getPaginatedData
}