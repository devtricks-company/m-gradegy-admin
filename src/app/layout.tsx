import 'src/global.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { QueryProvider } from 'src/lib/react-query';
import { schemeConfig } from 'src/theme/scheme-config';
import { ThemeProvider } from 'src/theme/theme-provider';
import { LocalizationProvider } from 'src/lib/localization-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { Snackbar } from 'src/components/snackbar';

import { AuthProvider } from 'src/auth/context/jwt';
import { WorkspaceProvider } from 'src/contexts/workspace-context';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={schemeConfig.defaultMode}
          modeStorageKey={schemeConfig.modeStorageKey}
        />

        <QueryProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <SettingsProvider settings={defaultSettings}>
                <ThemeProvider>
                  <LocalizationProvider>
                    <MotionLazy>
                      <ProgressBar />
                      <SettingsDrawer />
                      <Snackbar />
                      {children}
                    </MotionLazy>
                  </LocalizationProvider>
                </ThemeProvider>
              </SettingsProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
