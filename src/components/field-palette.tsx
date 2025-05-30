import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDraggable } from '@dnd-kit/core';
import { FieldType } from '../types/form';

type FieldOption = {
  type: FieldType;
  label: string;
  icon: string;
};

const fieldOptions: FieldOption[] = [
  { type: 'text', label: 'Text Field', icon: 'lucide:type' },
  { type: 'textarea', label: 'Text Area', icon: 'lucide:align-left' },
  { type: 'email', label: 'Email', icon: 'lucide:mail' },
  { type: 'number', label: 'Number', icon: 'lucide:hash' },
  { type: 'phone', label: 'Phone', icon: 'lucide:phone' },
  { type: 'url', label: 'URL', icon: 'lucide:link' },
  { type: 'date', label: 'Date', icon: 'lucide:calendar' },
  { type: 'dropdown', label: 'Dropdown', icon: 'lucide:chevron-down' },
  { type: 'checkbox', label: 'Checkbox', icon: 'lucide:check-square' },
  { type: 'radio', label: 'Radio', icon: 'lucide:circle' },
  { type: 'file', label: 'File Upload', icon: 'lucide:upload' },
  { type: 'password', label: 'Password', icon: 'lucide:lock' },
];

const DraggableFieldItem: React.FC<{ field: FieldOption }> = ({ field }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `field-palette-${field.type}`,
    data: {
      type: 'field-palette',
      fieldType: field.type,
      fieldLabel: field.label
    }
  });
  
  // Define color based on field type
  const getFieldColor = (type: FieldType) => {
    const colors: Record<FieldType, string> = {
      'text': 'from-blue-500 to-indigo-500',
      'textarea': 'from-indigo-500 to-purple-500',
      'email': 'from-blue-500 to-cyan-500',
      'number': 'from-cyan-500 to-teal-500',
      'phone': 'from-teal-500 to-green-500',
      'url': 'from-indigo-500 to-blue-500',
      'date': 'from-green-500 to-emerald-500',
      'dropdown': 'from-yellow-500 to-amber-500',
      'checkbox': 'from-amber-500 to-orange-500',
      'radio': 'from-red-500 to-rose-500',
      'file': 'from-pink-500 to-rose-500',
      'password': 'from-purple-500 to-pink-500',
    };
    
    return colors[type] || 'from-gray-500 to-gray-600';
  };
  
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab ${isDragging ? 'opacity-50' : ''}`}
    >
      <Button
        variant="flat"
        className={`w-full justify-start mb-2 bg-gradient-to-r ${getFieldColor(field.type)} bg-clip-text text-transparent border border-default-200`}
        startContent={<Icon icon={field.icon} className={`text-${field.type === 'text' ? 'blue' : field.type === 'textarea' ? 'indigo' : field.type === 'email' ? 'cyan' : field.type === 'number' ? 'teal' : field.type === 'phone' ? 'green' : field.type === 'date' ? 'emerald' : field.type === 'dropdown' ? 'yellow' : field.type === 'checkbox' ? 'amber' : field.type === 'radio' ? 'red' : field.type === 'file' ? 'pink' : field.type === 'password' ? 'purple' : 'default'}-500`} />}
      >
        {field.label}
      </Button>
    </div>
  );
};

const FieldPalette: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:layout-panel-left" className="text-primary" />
          <h3 className="text-lg font-medium gradient-header">Field Types</h3>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-default-500 text-sm mb-4">
          Drag and drop fields onto the form to add them
        </p>
        
        <div className="space-y-1">
          {fieldOptions.map((field) => (
            <DraggableFieldItem key={field.type} field={field} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default FieldPalette;