import { atom, RecoilEnv } from 'recoil';

// Workaround for a bug, https://recoiljs.org/blog/2022/10/11/recoil-0.7.6-release/
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const primaryColorState = atom<string>({
  key: 'primaryColorState',
  default: '#3c716b',
});

export const darkModeState = atom<boolean>({
  key: 'darkModeState',
  default: false,
});

export const polishVersionState = atom<boolean>({
  key: 'polishVersionState',
  default: false,
});

export const recordingURLState = atom<string>({
  key: 'recordingURLState',
  default: '',
});
