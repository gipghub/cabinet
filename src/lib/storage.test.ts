import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestPersistentStorage, storageEstimate } from './storage';

const originalStorage = navigator.storage;

function setStorage(value: unknown) {
  Object.defineProperty(navigator, 'storage', {
    value,
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  setStorage(originalStorage);
  vi.restoreAllMocks();
});

describe('requestPersistentStorage', () => {
  it('reports unsupported when the StorageManager is absent', async () => {
    setStorage(undefined);
    expect(await requestPersistentStorage()).toEqual({ supported: false, persisted: false });
  });

  it('does not re-request when storage is already persisted', async () => {
    const persist = vi.fn();
    setStorage({ persisted: vi.fn().mockResolvedValue(true), persist });
    const res = await requestPersistentStorage();
    expect(res).toEqual({ supported: true, persisted: true });
    expect(persist).not.toHaveBeenCalled(); // short-circuited
  });

  it('requests persistence and returns the granted result', async () => {
    setStorage({
      persisted: vi.fn().mockResolvedValue(false),
      persist: vi.fn().mockResolvedValue(true),
    });
    expect(await requestPersistentStorage()).toEqual({ supported: true, persisted: true });
  });

  it('returns persisted:false when the browser denies the request', async () => {
    setStorage({
      persisted: vi.fn().mockResolvedValue(false),
      persist: vi.fn().mockResolvedValue(false),
    });
    expect(await requestPersistentStorage()).toEqual({ supported: true, persisted: false });
  });

  it('degrades quietly if the API throws', async () => {
    setStorage({
      persisted: vi.fn().mockRejectedValue(new Error('blocked')),
      persist: vi.fn(),
    });
    expect(await requestPersistentStorage()).toEqual({ supported: false, persisted: false });
  });
});

describe('storageEstimate', () => {
  it('returns the estimate when available', async () => {
    const estimate = { quota: 1000, usage: 10 };
    setStorage({ estimate: vi.fn().mockResolvedValue(estimate) });
    expect(await storageEstimate()).toEqual(estimate);
  });

  it('returns null when unavailable', async () => {
    setStorage({});
    expect(await storageEstimate()).toBeNull();
  });
});
