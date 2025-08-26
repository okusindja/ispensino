import { CategoryFormData } from '@/zod';
import { MonographFormData } from '@/zod/monograph';

export interface CreateMonographProps {
  setToggle: () => void;
  loading: boolean;
  errorMsg: string | null;
  createMonograph: (data: MonographFormData) => Promise<void>;
}
