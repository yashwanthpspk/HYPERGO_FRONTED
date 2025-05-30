import React from 'react';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Tabs, 
  Tab, 
  Input, 
  Textarea, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormStore } from '../store/form-store';
import { formTemplates } from '../data/templates';
import FieldPalette from './field-palette';
import FormEditor from './form-editor';
import FormPreview from './form-preview';
import { useHistory } from 'react-router-dom';
import FormBuilderGraphic from './graphics/form-builder-graphic';

const FormBuilder: React.FC = () => {
  const history = useHistory();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [formTitle, setFormTitle] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState('editor');
  
  const { 
    currentForm, 
    createForm, 
    updateCurrentForm, 
    loadTemplate,
    canUndo,
    canRedo,
    undo,
    redo,
    forms
  } = useFormStore();
  
  React.useEffect(() => {
    // If no forms exist, create a default form
    if (forms.length === 0) {
      createForm('My Form');
    }
  }, [forms, createForm]);
  
  const handleCreateForm = () => {
    if (!formTitle.trim()) {
      addToast({
        title: "Form title is required",
        description: "Please enter a title for your form",
        severity: "warning"
      });
      return;
    }
    
    createForm(formTitle, formDescription);
    setFormTitle('');
    setFormDescription('');
    onClose();
    
    addToast({
      title: "Form created",
      description: "Your new form has been created successfully",
      severity: "success"
    });
  };
  
  const handleLoadTemplate = (templateId: string) => {
    const template = formTemplates.find(t => t.id === templateId);
    if (template) {
      loadTemplate(template);
      
      addToast({
        title: "Template loaded",
        description: `"${template.name}" template has been loaded successfully`,
        severity: "success"
      });
    }
  };
  
  const handleShareForm = () => {
    if (!currentForm) return;
    
    // Copy the shareable link to clipboard
    const shareableUrl = `${window.location.origin}/preview/${currentForm.id}`;
    navigator.clipboard.writeText(shareableUrl);
    
    addToast({
      title: "Link copied to clipboard",
      description: "Share this link with others to let them fill your form",
      severity: "success"
    });
  };
  
  const handleViewResponses = () => {
    if (!currentForm) return;
    history.push(`/responses/${currentForm.id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 gradient-header">Form Builder</h1>
          <p className="text-default-500">Create, customize, and share forms with ease</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={onOpen}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
          >
            New Form
          </Button>
          
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="flat" 
                startContent={<Icon icon="lucide:file-template" />}
                className="bg-gradient-to-r from-primary-100 to-secondary-100"
              >
                Templates
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Form Templates">
              {formTemplates.map(template => (
                <DropdownItem 
                  key={template.id}
                  description={template.description}
                  onPress={() => handleLoadTemplate(template.id)}
                >
                  {template.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          
          <Button 
            variant="flat"
            startContent={<Icon icon="lucide:share-2" />}
            isDisabled={!currentForm}
            onPress={handleShareForm}
            className="bg-gradient-to-r from-success-100 to-success-200"
          >
            Share
          </Button>
          
          <Button 
            variant="flat"
            startContent={<Icon icon="lucide:inbox" />}
            isDisabled={!currentForm}
            onPress={handleViewResponses}
            className="bg-gradient-to-r from-warning-100 to-warning-200"
          >
            Responses
          </Button>
        </div>
      </div>
      
      {!currentForm && (
        <div className="flex flex-col items-center justify-center py-12">
          <FormBuilderGraphic />
          <h2 className="text-2xl font-bold mt-6 mb-2">Welcome to FormCraft!</h2>
          <p className="text-default-500 text-center max-w-md mb-6">
            Create beautiful forms with our drag-and-drop builder. Get started by creating a new form or using a template.
          </p>
          <Button 
            color="primary" 
            size="lg"
            startContent={<Icon icon="lucide:plus" />}
            onPress={onOpen}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg confetti-button"
          >
            Create Your First Form
          </Button>
        </div>
      )}
      
      {currentForm && (
        <div className="mb-6">
          <Card className="gradient-card shadow-lg">
            <CardHeader className="flex justify-between items-center">
              <div className="flex flex-col">
                <Input
                  value={currentForm.title}
                  onChange={(e) => updateCurrentForm({ title: e.target.value })}
                  placeholder="Form Title"
                  variant="underlined"
                  className="text-xl font-bold"
                />
                <Textarea
                  value={currentForm.description || ''}
                  onChange={(e) => updateCurrentForm({ description: e.target.value })}
                  placeholder="Form Description (optional)"
                  variant="underlined"
                  minRows={1}
                  className="text-default-500"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  isIconOnly 
                  variant="light" 
                  isDisabled={!canUndo()}
                  onPress={undo}
                  className="bg-default-100"
                >
                  <Icon icon="lucide:undo-2" />
                </Button>
                <Button 
                  isIconOnly 
                  variant="light" 
                  isDisabled={!canRedo()}
                  onPress={redo}
                  className="bg-default-100"
                >
                  <Icon icon="lucide:redo-2" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
      
      {currentForm && (
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          aria-label="Form Builder Tabs"
          className="mb-6"
          color="secondary"
          variant="underlined"
        >
          <Tab 
            key="editor" 
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:edit-3" />
                <span>Editor</span>
              </div>
            }
          >
            <div className="form-builder-grid">
              <div className="bg-content1 rounded-medium p-4 overflow-y-auto max-h-[calc(100vh-200px)] shadow-lg">
                <FieldPalette />
              </div>
              <div className="bg-content1 rounded-medium p-4 overflow-y-auto max-h-[calc(100vh-200px)] shadow-lg">
                <FormEditor />
              </div>
            </div>
          </Tab>
          <Tab 
            key="preview" 
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:eye" />
                <span>Preview</span>
              </div>
            }
          >
            {currentForm && (
              <Card className="shadow-lg">
                <CardBody>
                  <FormPreview formId={currentForm.id} isPreviewMode={true} />
                </CardBody>
              </Card>
            )}
          </Tab>
        </Tabs>
      )}
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="gradient-header">Create New Form</ModalHeader>
              <ModalBody>
                <Input
                  label="Form Title"
                  placeholder="Enter form title"
                  value={formTitle}
                  onValueChange={setFormTitle}
                  isRequired
                  className="border-primary"
                />
                <Textarea
                  label="Form Description (optional)"
                  placeholder="Enter form description"
                  value={formDescription}
                  onValueChange={setFormDescription}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCreateForm}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                >
                  Create Form
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FormBuilder;