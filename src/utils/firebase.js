import * as R from "ramda"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

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
      const ref = firebase.database().ref(`/users/${currentUser.uid}`)
      ref.once("value").then(anonDataSnapshot => {
        const anonData = anonDataSnapshot.val()
        ref.remove()
        currentUser.delete()
        return firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(({ user }) => {
            const ref = firebase.database().ref(`/users/${user.uid}`)
            ref.once("value").then(dataSnapshot => {
              const data = dataSnapshot.val()
              setData(user, {
                ...data,
                current: anonData.current || data.current,
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

export const setData = async (user, data) =>
  firebase
    .database()
    .ref(`/users/${user.uid}`)
    .set(data)

export const subscribeToData = (user, handler) =>
  firebase
    .database()
    .ref(`/users/${user.uid}`)
    .on("value", handler)
