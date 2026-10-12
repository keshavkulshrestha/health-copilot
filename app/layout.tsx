import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MediMind AI — Your Personal Health Assistant',
  description:
    'AI-powered clinical health copilot. Encrypted report analysis, ABDM/FHIR compliant health insights, and bilingual English/Hindi assistance powered by Google Gemini.',
  keywords: ['health copilot', 'medical ai', 'gemini 1.5', 'abdm', 'blood test summary', 'patient portal'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
