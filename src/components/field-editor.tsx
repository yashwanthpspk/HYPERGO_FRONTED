import {
  Input,
  Checkbox,
  Button,
  Textarea,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormStore } from '../store/form-store';
import { FieldOption, FormField, ValidationRule } from '../types/form';
import { nanoid } from 'nanoid';

interface FieldEditorProps {
  field: FormField;
  stepId: string;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, stepId }) => {
  const { updateField } = useFormStore();
  const [newOptionLabel, setNewOptionLabel] = React.useState('');
  
  const handleUpdateField = (updates: Partial<FormField>) => {
    updateField(stepId, field.id, updates);
  };
  
  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return;
    
    const newOption: FieldOption = {
      id: nanoid(),
      label: newOptionLabel,
      value: newOptionLabel.toLowerCase().replace(/\s+/g, '-')
    };
    
    const updatedOptions = [...(field.options || []), newOption];
    handleUpdateField({ options: updatedOptions });
    setNewOptionLabel('');
  };
  
  const handleDeleteOption = (optionId: string) => {
    if (!field.options) return;
    
    const updatedOptions = field.options.filter(option => option.id !== optionId);
    handleUpdateField({ options: updatedOptions });
  };
  
  const handleToggleValidation = (type: ValidationRule['type'], isActive: boolean) => {
    const currentValidation = field.validation || [];
    
    if (isActive) {
      // Add validation rule
      let newRule: ValidationRule;
      
      switch (type) {
        case 'required':
          newRule = { type, message: 'This field is required' };
          break;
        case 'minLength':
          newRule = { type, value: '3', message: 'Minimum length is 3 characters' };
          break;
        case 'maxLength':
          newRule = { type, value: '100', message: 'Maximum length is 100 characters' };
          break;
        case 'pattern':
          newRule = { type, value: '', message: 'Invalid format' };
          break;
        case 'min':
          newRule = { type, value: '0', message: 'Minimum value is 0' };
          break;
        case 'max':
          newRule = { type, value: '100', message: 'Maximum value is 100' };
          break;
        default:
          newRule = { type, message: 'Validation error' };
      }
      
      handleUpdateField({ 
        validation: [...currentValidation, newRule],
        isRequired: type === 'required' ? true : field.isRequired
      });
    } else {
      // Remove validation rule
      const updatedValidation = currentValidation.filter(rule => rule.type !== type);
      handleUpdateField({ 
        validation: updatedValidation,
        isRequired: type === 'required' ? false : field.isRequired
      });
    }
  };
  
  const updateValidationRule = (type: ValidationRule['type'], updates: Partial<ValidationRule>) => {
    const currentValidation = field.validation || [];
    const updatedValidation = currentValidation.map(rule => 
      rule.type === type ? { ...rule, ...updates } : rule
    );
    
    handleUpdateField({ validation: updatedValidation });
  };
  
  const hasValidation = (type: ValidationRule['type']) => {
    return field.validation?.some(rule => rule.type === type) || false;
  };
  
  const getValidationRule = (type: ValidationRule['type']) => {
    return field.validation?.find(rule => rule.type === type);
  };
  
  return (
    <div className="space-y-4">
      <Input
        label="Field Label"
        value={field.label}
        onChange={(e) => handleUpdateField({ label: e.target.value })}
        size="sm"
      />
      
      <Input
        label="Placeholder"
        value={field.placeholder || ''}
        onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
        size="sm"
      />
      
      <Input
        label="Help Text"
        value={field.helpText || ''}
        onChange={(e) => handleUpdateField({ helpText: e.target.value })}
        size="sm"
      />
      
      {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Options</p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Option label"
              value={newOptionLabel}
              onChange={(e) => setNewOptionLabel(e.target.value)}
              size="sm"
              className="flex-1"
            />
            <Button size="sm" onPress={handleAddOption}>Add</Button>
          </div>
          
          <div className="space-y-2 mt-2">
            {field.options?.map(option => (
              <div key={option.id} className="flex items-center justify-between bg-content2 p-2 rounded-medium">
                <span>{option.label}</span>
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="danger"
                  onPress={() => handleDeleteOption(option.id)}
                >
                  <Icon icon="lucide:x" size={14} />
                </Button>
              </div>
            ))}
            
            {(!field.options || field.options.length === 0) && (
              <p className="text-default-400 text-xs">No options added yet</p>
            )}
          </div>
        </div>
      )}
      
      <Divider />
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Validation</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Required</span>
            <Checkbox
              isSelected={hasValidation('required')}
              onValueChange={(isSelected) => handleToggleValidation('required', isSelected)}
              size="sm"
            />
          </div>
          
          {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'password') && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">Minimum Length</span>
                <Checkbox
                  isSelected={hasValidation('minLength')}
                  onValueChange={(isSelected) => handleToggleValidation('minLength', isSelected)}
                  size="sm"
                />
              </div>
              
              {hasValidation('minLength') && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    label="Min Length"
                    value={getValidationRule('minLength')?.value || ''}
                    onChange={(e) => updateValidationRule('minLength', { value: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                  <Input
                    label="Error Message"
                    value={getValidationRule('minLength')?.message || ''}
                    onChange={(e) => updateValidationRule('minLength', { message: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Maximum Length</span>
                <Checkbox
                  isSelected={hasValidation('maxLength')}
                  onValueChange={(isSelected) => handleToggleValidation('maxLength', isSelected)}
                  size="sm"
                />
              </div>
              
              {hasValidation('maxLength') && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    label="Max Length"
                    value={getValidationRule('maxLength')?.value || ''}
                    onChange={(e) => updateValidationRule('maxLength', { value: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                  <Input
                    label="Error Message"
                    value={getValidationRule('maxLength')?.message || ''}
                    onChange={(e) => updateValidationRule('maxLength', { message: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                </div>
              )}
            </>
          )}
          
          {field.type === 'email' && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Format</span>
              <Checkbox
                isSelected={hasValidation('pattern')}
                onValueChange={(isSelected) => handleToggleValidation('pattern', isSelected)}
                size="sm"
                isDisabled
                isSelected={true}
              />
            </div>
          )}
          
          {field.type === 'number' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">Minimum Value</span>
                <Checkbox
                  isSelected={hasValidation('min')}
                  onValueChange={(isSelected) => handleToggleValidation('min', isSelected)}
                  size="sm"
                />
              </div>
              
              {hasValidation('min') && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    label="Min Value"
                    value={getValidationRule('min')?.value || ''}
                    onChange={(e) => updateValidationRule('min', { value: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                  <Input
                    label="Error Message"
                    value={getValidationRule('min')?.message || ''}
                    onChange={(e) => updateValidationRule('min', { message: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Maximum Value</span>
                <Checkbox
                  isSelected={hasValidation('max')}
                  onValueChange={(isSelected) => handleToggleValidation('max', isSelected)}
                  size="sm"
                />
              </div>
              
              {hasValidation('max') && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    label="Max Value"
                    value={getValidationRule('max')?.value || ''}
                    onChange={(e) => updateValidationRule('max', { value: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                  <Input
                    label="Error Message"
                    value={getValidationRule('max')?.message || ''}
                    onChange={(e) => updateValidationRule('max', { message: e.target.value })}
                    size="sm"
                    className="flex-1"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;