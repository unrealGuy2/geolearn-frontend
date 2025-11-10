import './globals.css';
import ClientWrapper from '@/components/ClientWrapper';

export const metadata = {
  title: 'GeoLearn Portal',
  description: 'Official materials portal for the Geology Department.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}