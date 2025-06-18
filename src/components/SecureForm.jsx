import FormValidator from './FormValidator';

const SecureForm = ({ onSubmit, initialValues, children }) => {
  return (
    <FormValidator onSubmit={onSubmit} initialValues={initialValues}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          {children({
            values,
            errors,
            touched,
            handleChange,
            handleBlur
          })}
        </form>
      )}
    </FormValidator>
  );
};

// Composant de champ de formulaire sécurisé
export const SecureInput = ({
  name,
  type = 'text',
  label,
  placeholder,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  className = ''
}) => {
  const hasError = touched[name] && errors[name];

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
      />
      {hasError && (
        <p className="text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );
};

// Composant de bouton de soumission sécurisé
export const SecureSubmitButton = ({ children, isLoading = false, className = '' }) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`
      w-full flex justify-center py-2 px-4 border border-transparent rounded-md
      shadow-sm text-sm font-medium text-white
      bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2
      focus:ring-offset-2 focus:ring-primary-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {isLoading ? (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ) : null}
    {children}
  </button>
);

export default SecureForm; 