// src/features/about/hooks/useContactForm.ts
import { useState } from 'react';
import { AboutService } from '../services/aboutService';
import type { ContactInfo } from '../types/about.types';
import { validateEmail, isEmpty, capitalize } from '../utils/aboutUtils';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface UseContactFormReturn {
  formData: ContactFormData;
  errors: ContactFormErrors;
  loading: boolean;
  success: boolean;
  contactInfo: ContactInfo | null;
  handleChange: (field: keyof ContactFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  validateForm: () => boolean;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

export const useContactForm = (): UseContactFormReturn => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    // Валидация имени
    if (isEmpty(formData.name)) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Валидация email
    if (isEmpty(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Валидация темы
    if (isEmpty(formData.subject)) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Валидация сообщения
    if (isEmpty(formData.message)) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Здесь может быть логика отправки формы на сервер
      // Для примера просто симулируем отправку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Получаем контактную информацию
      const contactData = await AboutService.getContactInfo();
      setContactInfo(contactData);
      
      setSuccess(true);
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // Здесь можно добавить обработку ошибок
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSuccess(false);
  };

  return {
    formData,
    errors,
    loading,
    success,
    contactInfo,
    handleChange,
    handleSubmit,
    resetForm,
    validateForm
  };
};