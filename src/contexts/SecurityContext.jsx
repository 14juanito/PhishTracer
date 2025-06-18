import { createContext, useContext, useReducer, useCallback } from 'react';
import useSecurityNotification from '../hooks/useSecurityNotification';

const SecurityContext = createContext();

const initialState = {
  isAuthenticated: false,
  isSecure: true,
  lastSecurityCheck: null,
  securityIssues: [],
  securityScore: 100
};

const securityReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload
      };
    case 'SET_SECURE':
      return {
        ...state,
        isSecure: action.payload
      };
    case 'UPDATE_SECURITY_CHECK':
      return {
        ...state,
        lastSecurityCheck: action.payload
      };
    case 'ADD_SECURITY_ISSUE':
      return {
        ...state,
        securityIssues: [...state.securityIssues, action.payload]
      };
    case 'REMOVE_SECURITY_ISSUE':
      return {
        ...state,
        securityIssues: state.securityIssues.filter(issue => issue.id !== action.payload)
      };
    case 'UPDATE_SECURITY_SCORE':
      return {
        ...state,
        securityScore: action.payload
      };
    default:
      return state;
  }
};

export const SecurityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(securityReducer, initialState);
  const {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  } = useSecurityNotification();

  const setAuthenticated = useCallback((isAuthenticated) => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: isAuthenticated });
    if (isAuthenticated) {
      showSuccess('Authentification réussie');
    } else {
      showInfo('Déconnexion réussie');
    }
  }, [showSuccess, showInfo]);

  const setSecure = useCallback((isSecure) => {
    dispatch({ type: 'SET_SECURE', payload: isSecure });
    if (!isSecure) {
      showWarning('Problème de sécurité détecté');
    }
  }, [showWarning]);

  const updateSecurityCheck = useCallback((timestamp) => {
    dispatch({ type: 'UPDATE_SECURITY_CHECK', payload: timestamp });
  }, []);

  const addSecurityIssue = useCallback((issue) => {
    dispatch({ type: 'ADD_SECURITY_ISSUE', payload: issue });
    showError(`Problème de sécurité : ${issue.message}`);
  }, [showError]);

  const removeSecurityIssue = useCallback((issueId) => {
    dispatch({ type: 'REMOVE_SECURITY_ISSUE', payload: issueId });
  }, []);

  const updateSecurityScore = useCallback((score) => {
    dispatch({ type: 'UPDATE_SECURITY_SCORE', payload: score });
    if (score < 50) {
      showWarning('Score de sécurité faible détecté');
    }
  }, [showWarning]);

  const value = {
    ...state,
    setAuthenticated,
    setSecure,
    updateSecurityCheck,
    addSecurityIssue,
    removeSecurityIssue,
    updateSecurityScore,
    notifications,
    removeNotification
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityContext; 