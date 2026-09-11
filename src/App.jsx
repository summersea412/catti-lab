import React from 'react';
import { routes } from './app/routes';
import DashboardLayout from './components/layout/DashboardLayout';
import FocusLayout from './components/layout/FocusLayout';
export default function App(){const [path,setPath]=React.useState('today'); const route=routes.find(r=>r.id===path)||routes[0]; const Page=route.component; const Layout=route.focus?FocusLayout:DashboardLayout; return <Layout active={path} onNavigate={setPath} route={route}><Page/></Layout>}
