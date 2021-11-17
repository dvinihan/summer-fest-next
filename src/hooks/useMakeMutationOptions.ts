import { UseMutationOptions } from 'react-query';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from './useNavigate';

export const useMakeMutationOptions =
  () =>
  ({
    successNavPath,
    successToastMessage,
    errorToastMessage,
    onSuccess,
  }: {
    successNavPath?: string;
    successToastMessage?: string;
    errorToastMessage?: string;
    onSuccess?: ({ data }: any, { inputs }: any) => void;
  } = {}): UseMutationOptions<any, any, any, any> => {
    const { setToastMessage, setIsLoading } = useAppContext();
    const navigate = useNavigate();

    return {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
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
