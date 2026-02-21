import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.psycovery.hopeforward',
  appName: 'Hope Forward',
  webDir: 'dist',
  bundledWebRuntime: false,

  ios: {
    contentInset: 'automatic',
    backgroundColor: '#4DAFE8',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#4DAFE8',
      iosSpinnerStyle: 'small',
      spinnerColor: '#F5C518',
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#4DAFE8',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },

  server: {
    // Remove this block for production — only used for live reload during dev
    // url: 'http://YOUR_LOCAL_IP:5173',
    // cleartext: true,
  },
};

export default config;
