import * as R from "ramda"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const makeRef = (uid, patchId) => {
  const userPath = `/users/${uid}`
  const path = patchId ? `${userPath}/patches/${patchId}` : userPath
  return firebase.database().ref(path)
}

export const initialize = () =>
  firebase.initializeApp({
    apiKey: "AIzaSyAUfjY5qEoCA49XnOS9bCZ2tAoaDD5L1rQ",
    authDomain: "www.rackless.cc",
    projectId: "rackless-cc",
    databaseURL: "https://rackless-cc.firebaseio.com",
    storageBucket: "rackless-cc.appspot.com"
  })

export const getCurrentUser = () => firebase.auth().currentUser

export const getCurrentOrAnonymousUser = async () =>
  new Promise(resolve => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      resolve(currentUser)
    } else {
      firebase
        .auth()
        .signInAnonymously()
        .then(({ user }) => resolve(user))
    }
  })

export const setLoginHandler = handler =>
  firebase.auth().onAuthStateChanged(handler)

export const signIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  const { currentUser } = firebase.auth()
  if (R.isNil(currentUser)) {
    return firebase.auth().signInWithPopup(provider)
  }
  return currentUser.linkWithPopup(provider).catch(({ code, credential }) => {
    if (code === "auth/credential-already-in-use") {
      const ref = makeRef(currentUser.uid)
      ref.once("value").then(anonDataSnapshot => {
        const anonData = anonDataSnapshot.val()
        ref.remove()
        currentUser.delete()
        return firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(({ user }) => {
            const ref = makeRef(user.uid)
            ref.once("value").then(dataSnapshot => {
              const data = dataSnapshot.val()
              setData(user, {
                ...data,
                current: R.prop("current", anonData) || R.prop("current", data),
                patches: { ...data.patches, ...anonData.patches }
              })
            })
          })
      })
    }
  })
}

export const signOut = async () => firebase.auth().signOut()

export const getDbKey = child => {
  const ref = firebase.database().ref()
  return ref.child(child).push().key
}

export const setData = async (user, data) => makeRef(user.uid).set(data)

export const subscribeToUser = (uid, handler) =>
  makeRef(uid).on("value", handler)

export const unsubscribeToUser = uid => makeRef(uid).off()

export const subscribeToUserPatch = (uid, patchId, handler) =>
  makeRef(uid, patchId).on("value", handler)

export const unsubscribeToUserPatch = (uid, patchId) =>
  makeRef(uid, patchId).off()
