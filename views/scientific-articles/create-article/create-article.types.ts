import { CategoryFormData } from '@/zod';
import { MonographFormData } from '@/zod/monograph';
import { ScientificArticleAuthorFormData } from '@/zod/scientific-article';

export interface CreateMonographProps {
  setToggle: () => void;
  loading: boolean;
  errorMsg: string | null;
  createMonograph: (data: MonographFormData) => Promise<void>;
}

export interface AuthorFormProps {
  onSubmit: (data: ScientificArticleAuthorFormData) => void;
  onCancel: () => void;
}
