import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Tabs,
  Tab,
  Input,
  Divider,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { useFormStore } from '../store/form-store';
import { FormField, FormStep } from '../types/form';
import FieldEditor from './field-editor';

const SortableField: React.FC<{ field: FormField; stepId: string }> = ({ field, stepId }) => {
  const { deleteField } = useFormStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: {
      type: 'form-field',
      field,
      stepId
    }
  });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const handleDeleteField = () => {
    deleteField(stepId, field.id);
    
    addToast({
      title: "Field deleted",
      description: `"${field.label}" field has been removed`,
      severity: "success"
    });
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`field-item ${field.type} bg-content2 rounded-medium p-3 mb-3 border border-default-200`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div {...listeners} className="cursor-grab">
            <Icon icon="lucide:grip-vertical" className="text-default-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{field.label}</span>
            <span className="text-xs text-default-500 capitalize">{field.type}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button isIconOnly size="sm" variant="light" onPress={() => {}}>
            <Icon icon="lucide:edit-2" size={16} />
          </Button>
          <Button isIconOnly size="sm" variant="light" color="danger" onPress={handleDeleteField}>
            <Icon icon="lucide:trash-2" size={16} />
          </Button>
        </div>
      </div>
      
      <Accordion className="mt-2">
        <AccordionItem
          key="field-settings"
          aria-label="Field Settings"
          title="Field Settings"
          classNames={{
            title: "text-sm",
            content: "pt-2"
          }}
        >
          <FieldEditor field={field} stepId={stepId} />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const StepContent: React.FC<{ step: FormStep; index: number }> = ({ step, index }) => {
  const { updateStep, deleteStep, reorderFields, addField } = useFormStore();
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Handle field reordering
      const activeIndex = step.fields.findIndex(field => field.id === active.id);
      const overIndex = step.fields.findIndex(field => field.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        reorderFields(step.id, activeIndex, overIndex);
      }
    }
  };
  
  const handleDeleteStep = () => {
    deleteStep(step.id);
    
    addToast({
      title: "Step deleted",
      description: `"${step.title}" step has been removed`,
      severity: "warning"
    });
  };
  
  return (
    <div className="mb-4">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex justify-between items-center bg-gradient-to-r from-primary-100/50 to-secondary-100/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm">
              {index + 1}
            </div>
            <Input
              value={step.title}
              onChange={(e) => updateStep(step.id, { title: e.target.value })}
              placeholder="Step Title"
              variant="underlined"
              className="font-medium"
            />
          </div>
          <Button 
            isIconOnly 
            size="sm" 
            variant="light" 
            color="danger" 
            onPress={handleDeleteStep}
            isDisabled={index === 0}
          >
            <Icon icon="lucide:trash-2" size={16} />
          </Button>
        </CardHeader>
        <CardBody>
          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={step.fields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {step.fields.length > 0 ? (
                step.fields.map(field => (
                  <SortableField key={field.id} field={field} stepId={step.id} />
                ))
              ) : (
                <div className="text-center py-8 text-default-400 border-2 border-dashed border-default-200 rounded-lg">
                  <Icon icon="lucide:layout" className="mx-auto mb-2" size={24} />
                  <p>Drag fields here to add them to this step</p>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </CardBody>
      </Card>
    </div>
  );
};

const FormEditor: React.FC = () => {
  const { currentForm, addStep, reorderSteps, addField } = useFormStore();
  const [activeStep, setActiveStep] = React.useState<string | null>(null);
  const [activeField, setActiveField] = React.useState<FormField | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'form-field') {
      setActiveField(event.active.data.current.field);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset active items
    setActiveField(null);
    setActiveStep(null);
    
    if (!over || !currentForm) return;
    
    // Handle field palette drag to form
    if (active.data.current?.type === 'field-palette' && over.data.current?.type === 'step-drop-area') {
      const stepId = over.data.current.stepId;
      const fieldType = active.data.current.fieldType;
      const fieldLabel = active.data.current.fieldLabel;
      
      addField(stepId, {
        type: fieldType,
        label: fieldLabel,
      });
      
      addToast({
        title: "Field added",
        description: `${fieldLabel} has been added to your form`,
        severity: "success"
      });
    }
    
    // Handle step reordering
    if (active.data.current?.type === 'form-step' && over.data.current?.type === 'form-step') {
      const activeIndex = currentForm.steps.findIndex(step => step.id === active.id);
      const overIndex = currentForm.steps.findIndex(step => step.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        reorderSteps(activeIndex, overIndex);
      }
    }
  };
  
  const handleDragOver = (event: any) => {
    const { over } = event;
    
    if (over && over.data.current?.type === 'step-drop-area') {
      setActiveStep(over.data.current.stepId);
    } else {
      setActiveStep(null);
    }
  };
  
  const handleAddStep = () => {
    addStep();
    
    addToast({
      title: "Step added",
      description: "A new step has been added to your form",
      severity: "success"
    });
  };
  
  if (!currentForm) {
    return (
      <div className="text-center py-12">
        <p>No form selected. Please create or select a form to start editing.</p>
      </div>
    );
  }
  
  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Form Structure</h3>
          <Button 
            size="sm" 
            color="primary" 
            variant="flat" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={handleAddStep}
          >
            Add Step
          </Button>
        </div>
        
        <Divider />
        
        {currentForm.steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`step-drop-area ${activeStep === step.id ? 'bg-primary-100 rounded-medium' : ''}`}
            data-step-id={step.id}
          >
            <StepContent step={step} index={index} />
          </div>
        ))}
        
        <DragOverlay>
          {activeField && (
            <div className="bg-content2 rounded-medium p-3 border border-default-200 w-64">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:grip-vertical" className="text-default-400" />
                <div>
                  <span className="font-medium">{activeField.label}</span>
                  <span className="text-xs text-default-500 block capitalize">{activeField.type}</span>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default FormEditor;