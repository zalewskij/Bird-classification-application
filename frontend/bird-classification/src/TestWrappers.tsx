import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </MemoryRouter>
  );
};
