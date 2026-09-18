import {COMPANION_ENABLED} from '../features/desktopPet/featureFlag';
import React from 'react';import UserProvider from '../features/user/UserProvider';import {CompanionProvider} from '../features/desktopPet/CompanionProvider';import DesktopPet from '../features/desktopPet/DesktopPet';import {TrainingProvider} from '../features/training/TrainingContext';export default function AppProviders({children}){return <UserProvider><TrainingProvider><CompanionProvider>{children}{COMPANION_ENABLED&&<DesktopPet/>}</CompanionProvider></TrainingProvider></UserProvider>}

