import { useRouter } from 'next/router';
import { useAppContext } from '../context/AppContext';

export const useNavigate = () => {
  const router = useRouter();
  const { setIsLoading } = useAppContext();

  return (path: string) => {
    setIsLoading(true);
    router.push(path);
  };
};
