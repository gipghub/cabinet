import type { ReactNode } from 'react';

export interface IOSDeviceProps {
  width?: number;
  height?: number;
  children: ReactNode;
}

/** Minimal iOS device frame used for the in-browser preview. */
export function IOSDevice({ width = 390, height = 844, children }: IOSDeviceProps) {
  return (
    <div
      style={{
        width,
        height,
        background: '#000',
        borderRadius: 52,
        padding: 12,
        boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--bg)',
          borderRadius: 42,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 150, height: 30, background: '#000',
            borderRadius: '0 0 18px 18px', zIndex: 50,
          }}
        />
        {children}
        <div
          style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            width: 130, height: 5, background: 'rgba(19,50,43,0.3)', borderRadius: 3, zIndex: 50,
          }}
        />
      </div>
    </div>
  );
}
