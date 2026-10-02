import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Local Lead Finder',description:'Find local businesses that need a website. Local search and CRM.',icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ru"><body>{children}</body></html>;}
