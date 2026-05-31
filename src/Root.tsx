import { App } from './App';
import { IOSDevice } from './components/IOSDevice';
import { InstallUI } from './components/InstallUI';
import { detectPWA } from './lib/pwa';

const pwa = detectPWA();

/**
 * Installed → the app fills the real screen.
 * Browser → the app sits inside a device frame, with an install banner.
 */
export function Root() {
  if (pwa.isStandalone) {
    return (
      <div className="fullapp">
        <App />
      </div>
    );
  }
  return (
    <>
      <div className="stage">
        <IOSDevice width={390} height={844}>
          <App />
        </IOSDevice>
      </div>
      <InstallUI />
    </>
  );
}
