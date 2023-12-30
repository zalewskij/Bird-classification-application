import { atom, AtomEffect, RecoilEnv } from 'recoil';

// Workaround for a bug, https://recoiljs.org/blog/2022/10/11/recoil-0.7.6-release/
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const localStorageEffect = <T>(key: string): AtomEffect<T> => ({setSelf, onSet}) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(newValue));
  });
};

export const darkModeState = atom<boolean>({
  key: 'darkModeState',
  default: false,
  effects: [
    localStorageEffect('darkModeState'),
  ],
});

export const polishVersionState = atom<boolean>({
  key: 'polishVersionState',
  default: false,
  effects: [
    localStorageEffect('polishVersionState'),
  ],
});

export const recordingState = atom<Blob | null>({
  key: 'recordingState',
  default: null,
  effects: [
    ({ onSet, setSelf }) => {
      const key = 'recordingState';
      const savedValue = localStorage.getItem(key);

      if (savedValue != null) {
        const regex = /^data:(.*);base64,(.*)$/;
        const match = savedValue.match(regex);
        if (match === null || match.length != 3) return;
        const [_, contentType, b64Data] = match;
        
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        const sliceSize = 512;

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        setSelf(blob);
      }

      onSet((newValue, _, isReset) => {
        if (isReset || newValue === null) {
          localStorage.removeItem(key);
          return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (typeof(reader.result) != 'string') return;
          localStorage.setItem(key, reader.result);
        });
        reader.readAsDataURL(newValue);
      });
    },
  ],
});

export const chosenFragmentState = atom<number[]>({
  key: 'chosenFragmentState',
  default: [],
  effects: [
    localStorageEffect('chosenFragmentState'),
  ],
});
