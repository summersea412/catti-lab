import { useContext } from 'react';
import { UserContext } from '../features/user/UserProvider';

export default function useCurrentUser() {
  const value = useContext(UserContext);
  if (!value) throw new Error('useCurrentUser must be used within UserProvider');
  return value;
}

