import { atom, RecoilEnv } from 'recoil';

// Workaround for a bug, https://recoiljs.org/blog/2022/10/11/recoil-0.7.6-release/
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const primaryColorState = atom({
  key: 'primaryColorState',
  default: '#3c716b',
});

export const darkModeState = atom({
  key: 'darkModeState',
  default: false,
});

export const polishVersionState = atom({
  key: 'polishVersionState',
  default: false,
});
