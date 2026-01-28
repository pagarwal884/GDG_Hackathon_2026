import React, { createContext, useContext, useState, useEffect } from "react"
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null) // "user" or "community"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user type from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        const communityDoc = await getDoc(doc(db, "communities", firebaseUser.uid))

        if (userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() })
          setUserType("user")
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("loginType", "user")
        } else if (communityDoc.exists()) {
          setUser({ ...firebaseUser, ...communityDoc.data() })
          setUserType("community")
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("loginType", "community")
        }
      } else {
        setUser(null)
        setUserType(null)
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("loginType")
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password, type = "user") => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Verify user type matches
    const collection = type === "user" ? "users" : "communities"
    const userDoc = await getDoc(doc(db, collection, userCredential.user.uid))
    
    if (!userDoc.exists()) {
      await signOut(auth)
      throw new Error(`No ${type} account found with this email`)
    }
    
    return userCredential
  }

  const signup = async (email, password, additionalData, type = "user") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Store user data in Firestore
    const collection = type === "user" ? "users" : "communities"
    await setDoc(doc(db, collection, userCredential.user.uid), {
      email,
      ...additionalData,
      createdAt: new Date().toISOString()
    })
    
    return userCredential
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
