export type FieldType = 
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'email'
  | 'number'
  | 'phone'
  | 'url'
  | 'password'
  | 'file';

export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
};

export type FieldOption = {
  id: string;
  label: string;
  value: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | string[] | boolean;
  options?: FieldOption[];
  validation?: ValidationRule[];
  isRequired?: boolean;
};

export type FormStep = {
  id: string;
  title: string;
  fields: FormField[];
};

export type Form = {
  id: string;
  title: string;
  description?: string;
  steps: FormStep[];
  createdAt: number;
  updatedAt: number;
};

export type FormResponse = {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: number;
};

export type FormTemplate = {
  id: string;
  name: string;
  description: string;
  form: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>;
};

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';
