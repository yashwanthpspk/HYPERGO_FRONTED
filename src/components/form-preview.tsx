import React from 'react';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter, 
  Input, 
  Textarea, 
  Checkbox, 
  RadioGroup, 
  Radio, 
  Select, 
  SelectItem, 
  DatePicker, 
  Progress,
  ButtonGroup,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormStore } from '../store/form-store';
import { Form, FormField, PreviewMode } from '../types/form';
import { useHistory, useParams } from 'react-router-dom';
import { parseDate } from '@internationalized/date';

interface FormPreviewProps {
  formId?: string;
  isPreviewMode?: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formId: propFormId, isPreviewMode = false }) => {
  const { formId: paramFormId } = useParams<{ formId: string }>();
  const formId = propFormId || paramFormId;
  
  const history = useHistory();
  const { loadForm, forms, previewMode, setPreviewMode, addResponse } = useFormStore();
  const [currentForm, setCurrentForm] = React.useState<Form | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  React.useEffect(() => {
    if (formId) {
      const form = forms.find(f => f.id === formId);
      if (form) {
        setCurrentForm(form);
      } else {
        // Form not found
        addToast({
          title: "Form not found",
          description: "The requested form could not be found",
          severity: "danger"
        });
      }
    }
  }, [formId, forms]);
  
  const currentStep = currentForm?.steps[currentStepIndex];
  
  const validateField = (field: FormField, value: any): string => {
    if (!field.validation) return '';
    
    for (const rule of field.validation) {
      switch (rule.type) {
        case 'required':
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return rule.message;
          }
          break;
        case 'minLength':
          if (typeof value === 'string' && value.length < Number(rule.value)) {
            return rule.message;
          }
          break;
        case 'maxLength':
          if (typeof value === 'string' && value.length > Number(rule.value)) {
            return rule.message;
          }
          break;
        case 'pattern':
          if (typeof value === 'string' && rule.value) {
            const pattern = new RegExp(rule.value);
            if (!pattern.test(value)) {
              return rule.message;
            }
          }
          break;
        case 'min':
          if (typeof value === 'number' && value < Number(rule.value)) {
            return rule.message;
          }
          break;
        case 'max':
          if (typeof value === 'number' && value > Number(rule.value)) {
            return rule.message;
          }
          break;
      }
    }
    
    return '';
  };
  
  const validateStep = (): boolean => {
    if (!currentStep) return true;
    
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    currentStep.fields.forEach(field => {
      const value = formValues[field.id];
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });
    
    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when field is changed
    if (formErrors[fieldId]) {
      setFormErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };
  
  const handleNextStep = () => {
    if (!validateStep()) return;
    
    if (currentForm && currentStepIndex < currentForm.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async () => {
    if (!validateStep() || !currentForm) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save response
      addResponse(currentForm.id, formValues);
      
      setIsSubmitting(false);
      
      addToast({
        title: "Form submitted",
        description: "Your response has been recorded successfully",
        severity: "success"
      });
      
      // Reset form
      setFormValues({});
      setCurrentStepIndex(0);
      
      if (!isPreviewMode) {
        // Redirect to thank you page or home
        history.push('/');
      }
    } catch (error) {
      setIsSubmitting(false);
      
      addToast({
        title: "Submission failed",
        description: "There was an error submitting your form",
        severity: "danger"
      });
    }
  };
  
  const renderField = (field: FormField) => {
    const value = formValues[field.id];
    const error = formErrors[field.id];
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'textarea':
        return (
          <Textarea
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'email':
        return (
          <Input
            key={field.id}
            type="email"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'number':
        return (
          <Input
            key={field.id}
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'phone':
        return (
          <Input
            key={field.id}
            type="tel"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'url':
        return (
          <Input
            key={field.id}
            type="url"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'password':
        return (
          <Input
            key={field.id}
            type="password"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'date':
        return (
          <DatePicker
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            value={value ? parseDate(value) : undefined}
            onChange={(date) => handleFieldChange(field.id, date?.toString())}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          />
        );
      case 'dropdown':
        return (
          <Select
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            selectedKeys={value ? [value] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleFieldChange(field.id, selectedKey);
            }}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
          >
            {field.options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <p className={`text-sm ${field.isRequired ? 'after:content-["*"] after:text-danger after:ml-0.5' : ''}`}>
              {field.label}
            </p>
            {field.options?.map(option => (
              <Checkbox
                key={option.id}
                value={option.value}
                isSelected={(value || []).includes(option.value)}
                onValueChange={(isSelected) => {
                  const currentValues = value || [];
                  const newValues = isSelected
                    ? [...currentValues, option.value]
                    : currentValues.filter(v => v !== option.value);
                  handleFieldChange(field.id, newValues);
                }}
              >
                {option.label}
              </Checkbox>
            ))}
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
            {field.helpText && <p className="text-default-500 text-xs">{field.helpText}</p>}
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <RadioGroup
              label={field.label}
              value={value || ''}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              isRequired={field.isRequired}
              isInvalid={!!error}
              errorMessage={error}
              description={field.helpText}
            >
              {field.options?.map(option => (
                <Radio key={option.id} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        );
      case 'file':
        return (
          <Input
            key={field.id}
            type="file"
            label={field.label}
            isRequired={field.isRequired}
            isInvalid={!!error}
            errorMessage={error}
            helperText={field.helpText}
            onChange={(e) => {
              const files = e.target.files;
              handleFieldChange(field.id, files);
            }}
          />
        );
      default:
        return null;
    }
  };
  
  if (!currentForm) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardBody className="flex flex-col items-center justify-center py-8">
            <Icon icon="lucide:file-question" className="text-default-400 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">Form Not Found</h3>
            <p className="text-default-500 text-center mb-4">
              The form you're looking for doesn't exist or has been deleted.
            </p>
            <Button color="primary" onPress={() => history.push('/')}>
              Go to Form Builder
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {isPreviewMode && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold gradient-header">Form Preview</h2>
          <ButtonGroup>
            <Button
              variant={previewMode === 'desktop' ? 'solid' : 'flat'}
              onPress={() => setPreviewMode('desktop')}
              startContent={<Icon icon="lucide:monitor" />}
              className={previewMode === 'desktop' ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' : ''}
            >
              Desktop
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'solid' : 'flat'}
              onPress={() => setPreviewMode('tablet')}
              startContent={<Icon icon="lucide:tablet" />}
              className={previewMode === 'tablet' ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' : ''}
            >
              Tablet
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'solid' : 'flat'}
              onPress={() => setPreviewMode('mobile')}
              startContent={<Icon icon="lucide:smartphone" />}
              className={previewMode === 'mobile' ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' : ''}
            >
              Mobile
            </Button>
          </ButtonGroup>
        </div>
      )}
      
      <div className={`preview-container ${isPreviewMode ? previewMode : ''}`}>
        <Card className="w-full shadow-lg">
          <CardHeader className="flex flex-col items-start bg-gradient-to-r from-primary-100/50 to-secondary-100/50">
            <h1 className="text-2xl font-bold gradient-header">{currentForm?.title}</h1>
            {currentForm?.description && (
              <p className="text-default-500 mt-1">{currentForm.description}</p>
            )}
            
            {currentForm?.steps.length > 1 && (
              <div className="w-full mt-4">
                <div className="step-indicator mb-4">
                  {currentForm.steps.map((step, idx) => (
                    <React.Fragment key={step.id}>
                      <div className={`step ${idx < currentStepIndex ? 'completed' : idx === currentStepIndex ? 'active' : ''}`}>
                        {idx + 1}
                      </div>
                      {idx < currentForm.steps.length - 1 && (
                        <div className={`step-connector ${idx < currentStepIndex ? 'completed' : idx === currentStepIndex ? 'active' : ''}`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Step {currentStepIndex + 1} of {currentForm.steps.length}</span>
                  <span>{currentStep?.title}</span>
                </div>
                <Progress 
                  value={(currentStepIndex + 1) / currentForm.steps.length * 100} 
                  className="w-full"
                  color="secondary"
                  showValueLabel={true}
                  classNames={{
                    indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
                  }}
                />
              </div>
            )}
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              {currentStep?.fields.map(field => renderField(field))}
              
              {currentStep?.fields.length === 0 && (
                <div className="text-center py-8 text-default-400">
                  <Icon icon="lucide:file-question" className="mx-auto mb-2" size={32} />
                  <p>No fields in this step</p>
                </div>
              )}
            </div>
          </CardBody>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="flat"
              onPress={handlePrevStep}
              isDisabled={currentStepIndex === 0}
              startContent={<Icon icon="lucide:arrow-left" />}
              className="bg-gradient-to-r from-default-100 to-default-200"
            >
              Previous
            </Button>
            
            {currentStepIndex < (currentForm?.steps.length || 0) - 1 ? (
              <Button
                color="primary"
                onPress={handleNextStep}
                endContent={<Icon icon="lucide:arrow-right" />}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                endContent={!isSubmitting && <Icon icon="lucide:check" />}
                className="bg-gradient-to-r from-success-500 to-success-600 text-white"
              >
                Submit
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FormPreview;