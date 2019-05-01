import * as R from "ramda"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

export const currentUser = () => firebase.auth().currentUser

export const initialize = () =>
  firebase.initializeApp({
    apiKey: "AIzaSyAUfjY5qEoCA49XnOS9bCZ2tAoaDD5L1rQ",
    authDomain: "www.rackless.cc",
    projectId: "rackless-cc",
    databaseURL: "https://rackless-cc.firebaseio.com",
    storageBucket: "rackless-cc.appspot.com"
  })

export const setLoginHandler = handler =>
  firebase.auth().onAuthStateChanged(handler)

export const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  const { currentUser } = firebase.auth()
  if (R.isNil(currentUser)) {
    firebase.auth().signInWithPopup(provider)
    return
  }
  currentUser.linkWithPopup(provider).catch(({ code, credential }) => {
    if (code === "auth/credential-already-in-use") {
      firebase
        .database()
        .ref(`/users/${currentUser.uid}`)
        .remove()
      currentUser.delete()
      firebase.auth().signInAndRetrieveDataWithCredential(credential)
    }
  })
}
