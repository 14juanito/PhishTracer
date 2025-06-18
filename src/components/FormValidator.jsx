import { useState, useEffect } from 'react';
import { sanitizeInput, isValidEmail, isStrongPassword, isValidUrl } from '../utils/security';

const FormValidator = ({ children, onSubmit, initialValues = {} }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email est requis';
        } else if (!isValidEmail(value)) {
          error = 'Email invalide';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Mot de passe requis';
        } else if (!isStrongPassword(value)) {
          error = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
        }
        break;

      case 'url':
        if (!value) {
          error = 'URL requise';
        } else if (!isValidUrl(value)) {
          error = 'URL invalide';
        }
        break;

      default:
        if (!value) {
          error = 'Ce champ est requis';
        }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setValues(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (touched[name]) {
      const error = validateField(name, sanitizedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valider tous les champs
    const newErrors = {};
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {})
    );

    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return children({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  });
};

export default FormValidator; 