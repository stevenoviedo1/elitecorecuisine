import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { supabase } from "../../../../lib/supabase"

// ============================================
// SECURE AUTH CONFIGURATION (Supabase-backed)
// Passwords are now hashed and stored in the database.
// This enables the owner to change their password from the dashboard.
// ============================================

// Fallback env-based users (used only if user not found in Supabase)
function getEnvFallbackUsers() {
  const users = [];

  if (process.env.OWNER_EMAIL && process.env.OWNER_PASSWORD) {
    users.push({
      id: "owner",
      name: "Owner",
      email: process.env.OWNER_EMAIL.toLowerCase(),
      password: process.env.OWNER_PASSWORD, // plain text fallback (legacy)
      role: "owner"
    });
  }

  if (process.env.WORKER_EMAIL && process.env.WORKER_PASSWORD) {
    users.push({
      id: "worker",
      name: "Worker",
      email: process.env.WORKER_EMAIL.toLowerCase(),
      password: process.env.WORKER_PASSWORD,
      role: "worker"
    });
  }

  // Development fallback only
  if (users.length === 0 && process.env.NODE_ENV !== "production") {
    console.warn("⚠️ No staff users found in Supabase or env. Using insecure dev fallback.");
    users.push(
      { id: "owner", name: "Owner", email: "owner@elitecorecuisine.com", password: "owner123", role: "owner" },
      { id: "worker", name: "Worker", email: "worker@elitecorecuisine.com", password: "worker123", role: "worker" }
    );
  }

  return users;
}

// Fetch user from Supabase staff_users table
async function getUserFromDatabase(email) {
  if (!email) return null;

  const { data, error } = await supabase
    .from('staff_users')
    .select('id, email, password_hash, role, name')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name || (data.role === 'owner' ? 'Owner' : 'Worker'),
    email: data.email,
    passwordHash: data.password_hash,
    role: data.role
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.toLowerCase()
        const password = credentials.password

        // 1. Try Supabase first (preferred - supports password changes)
        const dbUser = await getUserFromDatabase(email)

        if (dbUser && dbUser.passwordHash) {
          const isValid = await bcrypt.compare(password, dbUser.passwordHash)
          if (isValid) {
            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role
            }
          }
          return null // Wrong password for DB user
        }

        // 2. Fallback to environment variables (legacy support)
        const envUsers = getEnvFallbackUsers()
        const envUser = envUsers.find(u => u.email === email)

        if (envUser && envUser.password === password) {
          console.warn(`[Auth] Using legacy env password for ${email}. Consider migrating to staff_users table.`)
          return {
            id: envUser.id,
            name: envUser.name,
            email: envUser.email,
            role: envUser.role
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // In production you MUST set a strong NEXTAUTH_SECRET (minimum 32 chars)
  // Generate one with: openssl rand -base64 32
}

// NextAuth v5 beta export pattern
export const { handlers: { GET, POST }, auth } = NextAuth(authOptions)
