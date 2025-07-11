import { CategoryFormData } from '@/zod';

export interface CreateCategoryProps {
  setToggle: () => void;
  loading: boolean;
  errorMsg: string | null;
  createCategory: (data: CategoryFormData) => Promise<void>;
}
