export interface PWAInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  embedded: boolean;
}

export function detectPWA(): PWAInfo {
  const ua = navigator.userAgent || '';
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);

  // A genuinely-installed PWA runs as a top-level window. A preview running
  // inside an iframe reports display-mode: standalone but is NOT installed.
  let embedded = false;
  try {
    embedded = window.self !== window.top;
  } catch {
    embedded = true;
  }
  const displayStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    navigator.standalone === true;

  return { isIOS, isAndroid, isStandalone: displayStandalone && !embedded, embedded };
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/** Begin capturing the install prompt as early as possible. */
export function initInstallCapture(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.dispatchEvent(new Event('pwa-installable'));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.dispatchEvent(new Event('pwa-installed'));
  });
}

export function hasInstallPrompt(): boolean {
  return deferredPrompt !== null;
}

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable';
  await deferredPrompt.prompt();
  try {
    const choice = await deferredPrompt.userChoice;
    return choice.outcome;
  } catch {
    return 'dismissed';
  } finally {
    deferredPrompt = null;
  }
}
