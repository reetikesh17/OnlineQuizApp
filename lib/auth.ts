// Authentication configuration and utilities
export interface AuthUser {
  id: string
  email: string
  password: string
  name: string
}

// Authorized users - in a real app, this would be stored securely on the server
export const AUTHORIZED_USERS: AuthUser[] = [
  {
    id: "1",
    email: "johndoe@gmail.com",
    password: "123abc!@",
    name: "John Doe"
  },
  {
    id: "2", 
    email: "reetikesh@gmail.com",
    password: "123abc!@",
    name: "Reetikesh"
  },
  {
    id: "3",
    email: "srijan@gmail.com", 
    password: "123abc!@",
    name: "Srijan"
  }
]

/**
 * Validates user credentials against authorized users
 * @param email - User email
 * @param password - User password
 * @returns AuthUser if valid, null if invalid
 */
export function validateCredentials(email: string, password: string): AuthUser | null {
  const user = AUTHORIZED_USERS.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  )
  
  return user || null
}

/**
 * Checks if an email is in the authorized users list
 * @param email - Email to check
 * @returns boolean
 */
export function isAuthorizedEmail(email: string): boolean {
  return AUTHORIZED_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())
}