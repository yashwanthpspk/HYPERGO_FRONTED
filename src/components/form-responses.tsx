import React from 'react';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useFormStore } from '../store/form-store';
import { useParams, useHistory } from 'react-router-dom';
import { FormResponse } from '../types/form';
import { motion } from 'framer-motion';

const FormResponses: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const history = useHistory();
  const { forms, getFormResponses } = useFormStore();
  const [currentForm, setCurrentForm] = React.useState(forms.find(f => f.id === formId));
  const [responses, setResponses] = React.useState<FormResponse[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedResponse, setSelectedResponse] = React.useState<FormResponse | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const rowsPerPage = 10;
  
  React.useEffect(() => {
    if (formId) {
      const form = forms.find(f => f.id === formId);
      setCurrentForm(form);
      
      if (form) {
        const formResponses = getFormResponses(formId);
        setResponses(formResponses);
      }
    }
  }, [formId, forms, getFormResponses]);
  
  const pages = Math.ceil(responses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentResponses = responses.slice(startIndex, endIndex);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const handleViewResponse = (response: FormResponse) => {
    setSelectedResponse(response);
    onOpen();
  };
  
  const handleBackToBuilder = () => {
    history.push('/');
  };
  
  if (!currentForm) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12">
            <Icon icon="lucide:file-question" className="text-default-400 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">Form Not Found</h3>
            <p className="text-default-500 text-center mb-4">
              The form you're looking for doesn't exist or has been deleted.
            </p>
            <Button color="primary" onPress={handleBackToBuilder}>
              Go to Form Builder
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 gradient-header">{currentForm?.title} - Responses</h1>
          <p className="text-default-500">View all submitted responses for this form</p>
        </div>
        
        <Button 
          variant="flat" 
          startContent={<Icon icon="lucide:arrow-left" />}
          onPress={handleBackToBuilder}
          className="bg-gradient-to-r from-default-100 to-default-200"
        >
          Back to Builder
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">
          <h3 className="text-lg font-medium">Submissions ({responses.length})</h3>
        </CardHeader>
        <CardBody>
          {responses.length > 0 ? (
            <>
              <Table 
                aria-label="Form responses"
                removeWrapper
                bottomContent={
                  pages > 1 ? (
                    <div className="flex justify-center">
                      <Pagination
                        total={pages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        color="secondary"
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">SUBMISSION ID</TableColumn>
                  <TableColumn className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">DATE</TableColumn>
                  <TableColumn className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {currentResponses.map((response, index) => (
                    <TableRow key={response.id} className="hover:bg-default-50">
                      <TableCell>{response.id.substring(0, 8)}...</TableCell>
                      <TableCell>{formatDate(response.submittedAt)}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="primary"
                          onPress={() => handleViewResponse(response)}
                          className="bg-gradient-to-r from-primary-100 to-secondary-100"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon icon="lucide:inbox" className="mx-auto mb-4 text-default-400" size={48} />
              <h3 className="text-xl font-medium mb-2 gradient-header">No Responses Yet</h3>
              <p className="text-default-500 mb-6">
                This form hasn't received any submissions yet.
              </p>
              <Button 
                color="primary" 
                onPress={() => history.push(`/preview/${formId}`)}
                startContent={<Icon icon="lucide:external-link" />}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
              >
                Open Form
              </Button>
            </motion.div>
          )}
        </CardBody>
      </Card>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="gradient-header">Response Details</ModalHeader>
              <ModalBody>
                {selectedResponse && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-default-500">
                      <span>Submission ID: {selectedResponse.id}</span>
                      <span>Date: {formatDate(selectedResponse.submittedAt)}</span>
                    </div>
                    
                    <Table removeWrapper>
                      <TableHeader>
                        <TableColumn className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">FIELD</TableColumn>
                        <TableColumn className="bg-gradient-to-r from-primary-100/50 to-secondary-100/50">VALUE</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(selectedResponse.data).map(([fieldId, value], index) => {
                          // Find the field label from the form structure
                          let fieldLabel = fieldId;
                          currentForm.steps.forEach(step => {
                            const field = step.fields.find(f => f.id === fieldId);
                            if (field) {
                              fieldLabel = field.label;
                            }
                          });
                          
                          // Format the value for display
                          let displayValue = value;
                          if (Array.isArray(value)) {
                            displayValue = value.join(', ');
                          } else if (typeof value === 'boolean') {
                            displayValue = value ? 'Yes' : 'No';
                          } else if (value === null || value === undefined) {
                            displayValue = '-';
                          }
                          
                          return (
                            <TableRow key={fieldId} className={index % 2 === 0 ? 'bg-default-50' : ''}>
                              <TableCell className="font-medium">{fieldLabel}</TableCell>
                              <TableCell>{String(displayValue)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button 
                  variant="flat" 
                  onPress={onClose}
                  className="bg-gradient-to-r from-default-100 to-default-200"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FormResponses;