import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Form, FormField, FormStep, FormResponse, FormTemplate, PreviewMode } from '../types/form';

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  responses: FormResponse[];
  previewMode: PreviewMode;
  history: Form[];
  historyIndex: number;
  
  // Form actions
  createForm: (title: string, description?: string) => string;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  loadForm: (id: string) => Form | null;
  
  // Current form actions
  setCurrentForm: (form: Form | null) => void;
  updateCurrentForm: (updates: Partial<Form>) => void;
  
  // Step actions
  addStep: () => void;
  updateStep: (stepId: string, updates: Partial<FormStep>) => void;
  deleteStep: (stepId: string) => void;
  reorderSteps: (startIndex: number, endIndex: number) => void;
  
  // Field actions
  addField: (stepId: string, field: Partial<FormField>) => void;
  updateField: (stepId: string, fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (stepId: string, fieldId: string) => void;
  reorderFields: (stepId: string, startIndex: number, endIndex: number) => void;
  
  // Response actions
  addResponse: (formId: string, data: Record<string, any>) => string;
  getFormResponses: (formId: string) => FormResponse[];
  
  // Preview actions
  setPreviewMode: (mode: PreviewMode) => void;
  
  // Template actions
  loadTemplate: (template: FormTemplate) => void;
  
  // History actions
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      forms: [],
      currentForm: null,
      responses: [],
      previewMode: 'desktop',
      history: [],
      historyIndex: -1,
      
      createForm: (title, description = '') => {
        const id = nanoid();
        const newForm: Form = {
          id,
          title,
          description,
          steps: [
            {
              id: nanoid(),
              title: 'Step 1',
              fields: []
            }
          ],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set(state => ({
          forms: [...state.forms, newForm],
          currentForm: newForm,
          history: [newForm],
          historyIndex: 0
        }));
        
        return id;
      },
      
      updateForm: (form) => {
        set(state => ({
          forms: state.forms.map(f => f.id === form.id ? { ...form, updatedAt: Date.now() } : f)
        }));
      },
      
      deleteForm: (id) => {
        set(state => ({
          forms: state.forms.filter(form => form.id !== id),
          currentForm: state.currentForm?.id === id ? null : state.currentForm
        }));
      },
      
      loadForm: (id) => {
        const form = get().forms.find(form => form.id === id) || null;
        set({ currentForm: form, history: form ? [form] : [], historyIndex: form ? 0 : -1 });
        return form;
      },
      
      setCurrentForm: (form) => {
        set({ 
          currentForm: form,
          history: form ? [form] : [],
          historyIndex: form ? 0 : -1
        });
      },
      
      updateCurrentForm: (updates) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const updatedForm = {
          ...currentForm,
          ...updates,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      addStep: () => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const newStep: FormStep = {
          id: nanoid(),
          title: `Step ${currentForm.steps.length + 1}`,
          fields: []
        };
        
        const updatedForm = {
          ...currentForm,
          steps: [...currentForm.steps, newStep],
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      updateStep: (stepId, updates) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const updatedSteps = currentForm.steps.map(step => 
          step.id === stepId ? { ...step, ...updates } : step
        );
        
        const updatedForm = {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      deleteStep: (stepId) => {
        const currentForm = get().currentForm;
        if (!currentForm || currentForm.steps.length <= 1) return;
        
        const updatedSteps = currentForm.steps.filter(step => step.id !== stepId);
        
        const updatedForm = {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      reorderSteps: (startIndex, endIndex) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const steps = [...currentForm.steps];
        const [removed] = steps.splice(startIndex, 1);
        steps.splice(endIndex, 0, removed);
        
        const updatedForm = {
          ...currentForm,
          steps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      addField: (stepId, field) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const newField: FormField = {
          id: nanoid(),
          type: field.type || 'text',
          label: field.label || 'New Field',
          placeholder: field.placeholder || '',
          helpText: field.helpText || '',
          options: field.options || [],
          validation: field.validation || [],
          isRequired: field.isRequired || false
        };
        
        const updatedSteps = currentForm.steps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              fields: [...step.fields, newField]
            };
          }
          return step;
        });
        
        const updatedForm = {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      updateField: (stepId, fieldId, updates) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const updatedSteps = currentForm.steps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              fields: step.fields.map(field => 
                field.id === fieldId ? { ...field, ...updates } : field
              )
            };
          }
          return step;
        });
        
        const updatedForm = {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      deleteField: (stepId, fieldId) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const updatedSteps = currentForm.steps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              fields: step.fields.filter(field => field.id !== fieldId)
            };
          }
          return step;
        });
        
        const updatedForm = {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      reorderFields: (stepId, startIndex, endIndex) => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const updatedSteps = currentForm.steps.map(step => {
          if (step.id === stepId) {
            const fields = [...step.fields];
            const [removed] = fields.splice(startIndex, 1);
            fields.splice(endIndex, 0, removed);
            
            return {
              ...step,
              fields
            };
          }
          return step;
        });
        
        const updatedForm = {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: Date.now()
        };
        
        set(state => ({
          currentForm: updatedForm,
          forms: state.forms.map(f => f.id === currentForm.id ? updatedForm : f)
        }));
        
        get().saveToHistory();
      },
      
      addResponse: (formId, data) => {
        const id = nanoid();
        const newResponse: FormResponse = {
          id,
          formId,
          data,
          submittedAt: Date.now()
        };
        
        set(state => ({
          responses: [...state.responses, newResponse]
        }));
        
        return id;
      },
      
      getFormResponses: (formId) => {
        return get().responses.filter(response => response.formId === formId);
      },
      
      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },
      
      loadTemplate: (template) => {
        const id = nanoid();
        const newForm: Form = {
          ...template.form,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set(state => ({
          forms: [...state.forms, newForm],
          currentForm: newForm,
          history: [newForm],
          historyIndex: 0
        }));
        
        return id;
      },
      
      saveToHistory: () => {
        const currentForm = get().currentForm;
        if (!currentForm) return;
        
        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ ...currentForm });
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex <= 0) return;
        
        const prevForm = history[historyIndex - 1];
        
        set(state => ({
          historyIndex: historyIndex - 1,
          currentForm: prevForm,
          forms: state.forms.map(f => f.id === prevForm.id ? prevForm : f)
        }));
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 1) return;
        
        const nextForm = history[historyIndex + 1];
        
        set(state => ({
          historyIndex: historyIndex + 1,
          currentForm: nextForm,
          forms: state.forms.map(f => f.id === nextForm.id ? nextForm : f)
        }));
      },
      
      canUndo: () => {
        return get().historyIndex > 0;
      },
      
      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      }
    }),
    {
      name: 'form-builder-storage'
    }
  )
);
