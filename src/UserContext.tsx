import { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
import { User } from './types'

interface UserContextProps {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const UserContext = createContext<UserContextProps>({ 
  user: null, 
  setUser: () => {},
  loading: true,
  setLoading: () => {}
})

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as User | null) // Type assertion to User (instead of Firebase
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  )
}