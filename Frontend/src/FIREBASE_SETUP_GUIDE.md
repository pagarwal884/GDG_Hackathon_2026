# Firebase Integration Setup Guide

## Overview
This guide explains how to integrate Firebase Authentication and Firestore with your Local Baithak application.

## Files Updated/Created

### 1. **AuthContext.jsx** (NEW)
- Location: `src/AuthContext.jsx`
- Purpose: Manages authentication state across the app
- Features:
  - User authentication state management
  - Login/Signup/Logout functions
  - Automatic user type detection (user/community)
  - LocalStorage sync for persistence

### 2. **firebase.js** (UPDATED)
- Location: `src/firebase.js`
- Changes: 
  - Fixed import statements
  - Added Firebase Storage initialization
  - Cleaned up configuration

### 3. **Login.jsx** (UPDATED)
- Location: `src/pages/Login.jsx`
- Changes:
  - Integrated Firebase authentication
  - Added error handling with toast notifications
  - Validates user type (user/community)
  - Loading states during authentication

### 4. **Signup.jsx** (UPDATED)
- Location: `src/pages/Signup.jsx`
- Changes:
  - Firebase user registration
  - Password validation
  - Stores user data in Firestore
  - Error handling with user-friendly messages

### 5. **SignupCommunity.jsx** (UPDATED)
- Location: `src/pages/SignupCommunity.jsx`
- Changes:
  - Community registration with Firebase
  - Logo upload to Firebase Storage
  - Stores community data in Firestore
  - Password validation

### 6. **Navbar.jsx** (UPDATED)
- Location: `src/components/Navbar.jsx`
- Changes:
  - Uses `useAuth()` hook instead of localStorage
  - Real-time user state updates
  - Displays user avatar based on Firebase user

### 7. **App.jsx** (UPDATED)
- Location: `src/App.jsx`
- Changes:
  - Wrapped with `AuthProvider`
  - Enables authentication context throughout app

### 8. **ProfilePage.jsx** (UPDATED)
- Location: `src/pages/ProfilePage.jsx`
- Changes:
  - Displays Firebase user information
  - Logout functionality
  - Protected route (redirects to login if not authenticated)

## Installation Steps

### 1. Install Required Dependencies
```bash
npm install firebase react-hot-toast
```

### 2. Firebase Console Setup

#### Enable Authentication:
1. Go to Firebase Console → Authentication
2. Enable "Email/Password" sign-in method

#### Setup Firestore Database:
1. Go to Firestore Database
2. Create database in production mode
3. Create two collections:
   - `users` - for regular users
   - `communities` - for community accounts

#### Setup Storage:
1. Go to Storage
2. Get started with default rules
3. Update rules for community logos:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /community-logos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Firestore Security Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Communities collection
    match /communities/{communityId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == communityId;
    }
  }
}
```

### 3. File Structure
```
src/
├── AuthContext.jsx           (NEW)
├── firebase.js               (UPDATED)
├── App.jsx                   (UPDATED)
├── components/
│   └── Navbar.jsx           (UPDATED)
└── pages/
    ├── Login.jsx            (UPDATED)
    ├── Signup.jsx           (UPDATED)
    ├── SignupCommunity.jsx  (UPDATED)
    └── ProfilePage.jsx      (UPDATED)
```

### 4. Replace Files
Copy the updated files to their respective locations in your project:

1. Copy `AuthContext.jsx` to `src/AuthContext.jsx`
2. Replace `src/firebase.js` with the updated version
3. Replace all updated page and component files

## How It Works

### Authentication Flow

#### User Registration:
1. User fills signup form
2. Firebase creates authentication account
3. User data stored in Firestore `users` collection
4. Automatically logged in and redirected

#### Community Registration:
1. Community fills registration form
2. Logo uploaded to Firebase Storage
3. Firebase creates authentication account
4. Community data stored in Firestore `communities` collection
5. Automatically logged in and redirected

#### Login:
1. User/Community enters credentials
2. Firebase authenticates
3. App checks Firestore for user type
4. Sets authentication state
5. Redirects to appropriate page

#### Logout:
1. User clicks logout
2. Firebase signs out
3. Local state cleared
4. Redirected to login page

### State Management

The `AuthContext` provides:
- `user` - Current user object (null if not logged in)
- `userType` - "user" or "community"
- `loading` - Loading state during auth check
- `login(email, password, type)` - Login function
- `signup(email, password, data, type)` - Signup function
- `logout()` - Logout function

### Using Auth in Components

```jsx
import { useAuth } from "../AuthContext"

const MyComponent = () => {
  const { user, userType, login, logout } = useAuth()
  
  if (!user) {
    return <p>Please login</p>
  }
  
  return (
    <div>
      <p>Welcome {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Testing

### Test User Registration:
1. Navigate to `/signin`
2. Fill in user details
3. Submit form
4. Should redirect to home page

### Test Community Registration:
1. Navigate to `/signincommunity`
2. Fill in community details
3. Upload logo (optional)
4. Submit form
5. Should redirect to communities page

### Test Login:
1. Navigate to `/login`
2. Toggle between User/Community
3. Enter credentials
4. Should redirect based on account type

### Test Logout:
1. Click user avatar in navbar
2. Navigate to profile page
3. Click logout button
4. Should redirect to login page

## Troubleshooting

### Common Issues:

**Issue**: "Firebase: Error (auth/email-already-in-use)"
- Solution: Email is already registered, use different email or login

**Issue**: "No user/community account found with this email"
- Solution: User logged in with wrong account type (trying community login with user account)

**Issue**: Storage upload fails
- Solution: Check Firebase Storage rules and ensure authentication is working

**Issue**: User data not showing
- Solution: Check Firestore rules and ensure user document was created

## Security Notes

1. **Never commit firebase.js with real credentials to public repos**
2. Use environment variables for production:
   ```js
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     // ... other configs
   }
   ```

3. Keep Firestore rules restrictive
4. Validate all user inputs
5. Use Firebase Security Rules to protect data

## Next Steps

To extend this integration:

1. **Add email verification**
2. **Implement password reset**
3. **Add profile photo upload for users**
4. **Implement following/unfollowing communities in Firestore**
5. **Store events and bookings in Firestore**
6. **Add real-time updates with Firestore listeners**

## Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
