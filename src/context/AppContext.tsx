import { createContext, useContext, useState } from 'react';

type AppContextProps = {
  toastMessage: string;
  setToastMessage: (toastMessage?: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const AppContext = createContext<AppContextProps>(null);

export const AppContextProvider = ({ children }: any) => {
  const [toastMessage, setToastMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        toastMessage,
        setToastMessage,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
