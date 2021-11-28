import { UseMutationOptions } from 'react-query';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from './useNavigate';

export const useMakeMutationOptions = () => {
  const { setToastMessage, setIsLoading } = useAppContext();
  const navigate = useNavigate();

  return ({
    successNavPath,
    successToastMessage,
    errorToastMessage,
    onSettled,
    onSuccess,
  }: {
    successNavPath?: string;
    successToastMessage?: string;
    errorToastMessage?: string;
    onSettled?: () => void;
    onSuccess?: ({ data }: any, { inputs }: any) => void;
  } = {}): UseMutationOptions<any, any, any, any> => {
    return {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled:
        onSettled ??
        (() => {
          setIsLoading(false);
        }),
      onError: () => {
        setToastMessage(
          errorToastMessage || 'There has been an error. Please try again.'
        );
      },
      onSuccess:
        onSuccess ??
        (() => {
          navigate(successNavPath);
          setToastMessage(successToastMessage);
        }),
    };
  };
};
