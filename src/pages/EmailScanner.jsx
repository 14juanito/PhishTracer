import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiShield, FiAlertTriangle, FiCheckCircle, FiClock, FiInfo, FiUpload } from 'react-icons/fi';
import axios from 'axios';

const EmailScanner = () => {
  const { currentUser } = useAuth();
  const [emailContent, setEmailContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);1
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailContent.trim() && !selectedFile) {
      setError('Veuillez entrer le contenu de l\'email ou sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response;
      
      if (selectedFile) {
        // Upload file
        const formData = new FormData();
        formData.append('emailFile', selectedFile);
        
        response = await axios.post('/api/scans/email/file', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Send email content
        response = await axios.post('/api/scans/email/content', { emailContent: emailContent.trim() }, {
          withCredentials: true
        });
      }

      const data = response.data;

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Erreur lors du scan');
      }
    } catch (error) {
      console.error('Erreur de scan email:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Le fichier est trop volumineux. Taille maximale : 10MB');
        return;
      }
      setSelectedFile(file);
      setEmailContent(''); // Clear text content when file is selected
      setError('');
    }
  };

  const handleTextChange = (e) => {
    setEmailContent(e.target.value);
    setSelectedFile(null); // Clear file when text is entered
    setError('');
  };

  const getVerdictColor = (isPhishing) => {
    return isPhishing ? 'text-red-600' : 'text-green-600';
  };

  const getVerdictBg = (isPhishing) => {
    return isPhishing ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  };

  const getVerdictIcon = (isPhishing) => {
    return isPhishing ? <FiAlertTriangle className="w-6 h-6" /> : <FiCheckCircle className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Scanner d'Email</h1>
            <p className="text-gray-600 mt-1">Analysez le contenu d'un email pour détecter les menaces de phishing</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scanner Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiMail className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyse d'Email</h2>
            <p className="text-gray-600">Collez le contenu de l'email ou téléchargez un fichier</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Input Method Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => {
                    setEmailContent('');
                    setSelectedFile(null);
                    setError('');
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    !selectedFile ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Contenu texte
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailContent('');
                    setSelectedFile(null);
                    setError('');
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedFile ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Fichier
                </button>
              </nav>
            </div>

            {/* Text Input */}
            {!selectedFile && (
              <div>
                <label htmlFor="emailContent" className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de l'email
                </label>
                <textarea
                  id="emailContent"
                  value={emailContent}
                  onChange={handleTextChange}
                  placeholder="Collez ici le contenu de l'email (en-têtes, corps, liens, etc.)"
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  required={!selectedFile}
                />
              </div>
            )}

            {/* File Upload */}
            {!emailContent && (
              <div>
                <label htmlFor="emailFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier email (.eml, .msg, .txt)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="emailFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Télécharger un fichier</span>
                        <input
                          id="emailFile"
                          name="emailFile"
                          type="file"
                          accept=".eml,.msg,.txt"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      .eml, .msg, .txt jusqu'à 10MB
                    </p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center">
                    <FiMail className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
                type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyse en cours...
                </div>
              ) : (
                'Analyser l\'email'
              )}
            </motion.button>
            </form>
        </motion.div>

        {/* Results */}
        {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className={`px-6 py-4 ${getVerdictBg(result.isPhishing)}`}>
              <div className="flex items-center">
                <div className={`${getVerdictColor(result.isPhishing)}`}>
                  {getVerdictIcon(result.isPhishing)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Résultat de l'analyse
                  </h3>
                  <p className={`text-sm font-medium ${getVerdictColor(result.isPhishing)}`}>
                    {result.isPhishing ? 'Email malveillant détecté' : 'Email sécurisé'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Détails de l'email
                  </h4>
                  <div className="space-y-3">
                    {result.sender && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Expéditeur</label>
                        <p className="text-sm text-gray-900">{result.sender}</p>
                      </div>
                    )}
                    {result.subject && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Objet</label>
                        <p className="text-sm text-gray-900">{result.subject}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Verdict</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.isPhishing 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {result.isPhishing ? 'Phishing détecté' : 'Sûr'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Confiance</label>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              result.isPhishing ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${result.confidence || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{result.confidence || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Informations du scan
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Date du scan</label>
                        <p className="text-sm text-gray-900">
                          {new Date(result.scanDate || Date.now()).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiShield className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Source</label>
                        <p className="text-sm text-gray-900">API CheckPhish</p>
                      </div>
                    </div>
                    {result.details && (
                      <div className="flex items-start">
                        <FiInfo className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Détails</label>
                          <p className="text-sm text-gray-900">{result.details}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Threats Detected */}
              {result.threats && result.threats.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Menaces détectées
                  </h4>
                  <div className="space-y-2">
                    {result.threats.map((threat, index) => (
                      <div key={index} className="flex items-start">
                        <FiAlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900 font-medium">{threat.type}</p>
                          <p className="text-sm text-gray-600">{threat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Recommandations
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {result.isPhishing ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>⚠️ Attention :</strong> Cet email a été identifié comme malveillant.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Ne cliquez sur aucun lien dans cet email</li>
                        <li>• Ne téléchargez aucun pièce jointe</li>
                        <li>• Ne répondez pas à cet email</li>
                        <li>• Supprimez cet email immédiatement</li>
                        <li>• Signalez-le à votre équipe IT</li>
                      </ul>
                    </div>
                  ) : (
              <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>✅ Sécurisé :</strong> Cet email semble sûr.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• L'email ne présente pas de signes de phishing</li>
                        <li>• Vous pouvez procéder avec prudence</li>
                        <li>• Restez vigilant aux demandes d'informations sensibles</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </motion.div>
          )}

        {/* Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-start">
            <FiInfo className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-2">Conseils de sécurité email</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vérifiez l'adresse de l'expéditeur avant de répondre</li>
                <li>• Méfiez-vous des emails urgents demandant des actions immédiates</li>
                <li>• Ne cliquez jamais sur des liens suspects</li>
                <li>• Vérifiez l'orthographe et la grammaire</li>
                <li>• Utilisez la vérification en deux étapes</li>
              </ul>
            </div>
          </div>
        </motion.div>
        </div>
    </div>
  );
};

export default EmailScanner; 