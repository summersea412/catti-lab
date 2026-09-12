import React from 'react';
import UserProvider from '../features/user/UserProvider';
export default function AppProviders({ children }) {
  return <UserProvider>{children}</UserProvider>;
}

