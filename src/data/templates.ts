import { FormTemplate } from '../types/form';
import { nanoid } from 'nanoid';

export const formTemplates: FormTemplate[] = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'A simple contact form with name, email, and message fields',
    form: {
      title: 'Contact Us',
      description: 'We\'d love to hear from you! Please fill out the form below.',
      steps: [
        {
          id: nanoid(),
          title: 'Contact Information',
          fields: [
            {
              id: nanoid(),
              type: 'text',
              label: 'Full Name',
              placeholder: 'Enter your full name',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your name'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'email',
              label: 'Email Address',
              placeholder: 'Enter your email address',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your email address'
                },
                {
                  type: 'pattern',
                  value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                  message: 'Please enter a valid email address'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'textarea',
              label: 'Message',
              placeholder: 'How can we help you?',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your message'
                },
                {
                  type: 'minLength',
                  value: '10',
                  message: 'Message must be at least 10 characters'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'A multi-step job application form with personal and professional information',
    form: {
      title: 'Job Application',
      description: 'Please complete all sections of this application form.',
      steps: [
        {
          id: nanoid(),
          title: 'Personal Information',
          fields: [
            {
              id: nanoid(),
              type: 'text',
              label: 'Full Name',
              placeholder: 'Enter your full name',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your name'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'email',
              label: 'Email Address',
              placeholder: 'Enter your email address',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your email address'
                },
                {
                  type: 'pattern',
                  value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                  message: 'Please enter a valid email address'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'phone',
              label: 'Phone Number',
              placeholder: 'Enter your phone number',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your phone number'
                }
              ]
            }
          ]
        },
        {
          id: nanoid(),
          title: 'Professional Information',
          fields: [
            {
              id: nanoid(),
              type: 'text',
              label: 'Current Position',
              placeholder: 'Enter your current job title',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your current position'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'dropdown',
              label: 'Years of Experience',
              isRequired: true,
              options: [
                { id: nanoid(), label: '0-1 years', value: '0-1' },
                { id: nanoid(), label: '2-3 years', value: '2-3' },
                { id: nanoid(), label: '4-6 years', value: '4-6' },
                { id: nanoid(), label: '7+ years', value: '7+' }
              ],
              validation: [
                {
                  type: 'required',
                  message: 'Please select your years of experience'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'textarea',
              label: 'Why do you want to work with us?',
              placeholder: 'Tell us why you want to join our team',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please tell us why you want to work with us'
                },
                {
                  type: 'minLength',
                  value: '50',
                  message: 'Response must be at least 50 characters'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'A form for registering to events with personal details and preferences',
    form: {
      title: 'Event Registration',
      description: 'Register for our upcoming event by filling out this form.',
      steps: [
        {
          id: nanoid(),
          title: 'Attendee Information',
          fields: [
            {
              id: nanoid(),
              type: 'text',
              label: 'Full Name',
              placeholder: 'Enter your full name',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your name'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'email',
              label: 'Email Address',
              placeholder: 'Enter your email address',
              isRequired: true,
              validation: [
                {
                  type: 'required',
                  message: 'Please enter your email address'
                },
                {
                  type: 'pattern',
                  value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                  message: 'Please enter a valid email address'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'dropdown',
              label: 'T-Shirt Size',
              options: [
                { id: nanoid(), label: 'Small', value: 'S' },
                { id: nanoid(), label: 'Medium', value: 'M' },
                { id: nanoid(), label: 'Large', value: 'L' },
                { id: nanoid(), label: 'X-Large', value: 'XL' }
              ]
            }
          ]
        },
        {
          id: nanoid(),
          title: 'Event Preferences',
          fields: [
            {
              id: nanoid(),
              type: 'checkbox',
              label: 'Which sessions are you interested in attending?',
              options: [
                { id: nanoid(), label: 'Morning Keynote', value: 'keynote' },
                { id: nanoid(), label: 'Technical Workshop', value: 'workshop' },
                { id: nanoid(), label: 'Networking Lunch', value: 'lunch' },
                { id: nanoid(), label: 'Panel Discussion', value: 'panel' }
              ]
            },
            {
              id: nanoid(),
              type: 'radio',
              label: 'Dietary Preferences',
              options: [
                { id: nanoid(), label: 'No Restrictions', value: 'none' },
                { id: nanoid(), label: 'Vegetarian', value: 'vegetarian' },
                { id: nanoid(), label: 'Vegan', value: 'vegan' },
                { id: nanoid(), label: 'Gluten-Free', value: 'gluten-free' }
              ]
            },
            {
              id: nanoid(),
              type: 'textarea',
              label: 'Additional Notes',
              placeholder: 'Any other information we should know?'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'feedback-survey',
    name: 'Feedback Survey',
    description: 'A customer feedback form with ratings and comments',
    form: {
      title: 'Customer Feedback',
      description: 'We value your feedback! Please take a moment to share your thoughts.',
      steps: [
        {
          id: nanoid(),
          title: 'Your Experience',
          fields: [
            {
              id: nanoid(),
              type: 'dropdown',
              label: 'How would you rate your overall experience?',
              isRequired: true,
              options: [
                { id: nanoid(), label: 'Excellent', value: '5' },
                { id: nanoid(), label: 'Good', value: '4' },
                { id: nanoid(), label: 'Average', value: '3' },
                { id: nanoid(), label: 'Below Average', value: '2' },
                { id: nanoid(), label: 'Poor', value: '1' }
              ],
              validation: [
                {
                  type: 'required',
                  message: 'Please rate your experience'
                }
              ]
            },
            {
              id: nanoid(),
              type: 'checkbox',
              label: 'Which aspects did you enjoy the most?',
              options: [
                { id: nanoid(), label: 'Product Quality', value: 'quality' },
                { id: nanoid(), label: 'Customer Service', value: 'service' },
                { id: nanoid(), label: 'Price', value: 'price' },
                { id: nanoid(), label: 'Website Experience', value: 'website' }
              ]
            },
            {
              id: nanoid(),
              type: 'textarea',
              label: 'What could we improve?',
              placeholder: 'Please share your suggestions'
            }
          ]
        },
        {
          id: nanoid(),
          title: 'About You',
          fields: [
            {
              id: nanoid(),
              type: 'text',
              label: 'Name (Optional)',
              placeholder: 'Enter your name'
            },
            {
              id: nanoid(),
              type: 'email',
              label: 'Email (Optional)',
              placeholder: 'Enter your email if you\'d like us to follow up'
            },
            {
              id: nanoid(),
              type: 'checkbox',
              label: 'May we contact you about your feedback?',
              options: [
                { id: nanoid(), label: 'Yes, you may contact me', value: 'yes' }
              ]
            }
          ]
        }
      ]
    }
  }
];
