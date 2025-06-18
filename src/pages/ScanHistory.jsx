import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await axios.get('/api/scans/my-scans', {
        withCredentials: true
      });
      setScans(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch scan history');
      setLoading(false);
    }
  };

  const handleDelete = async (scanId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      try {
        await axios.delete(`/api/scans/${scanId}`, {
          withCredentials: true
        });
        setScans(scans.filter(scan => scan._id !== scanId));
      } catch (err) {
        setError('Failed to delete scan');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Scan History</h1>
      
      {scans.length === 0 ? (
        <div className="text-center text-gray-500">
          No scans found. Start by scanning a URL!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scans.map((scan) => (
            <div key={scan._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {scan.verdict === 'phishing' ? (
                    <FiAlertCircle className="text-red-500 text-xl mr-2" />
                  ) : (
                    <FiCheckCircle className="text-green-500 text-xl mr-2" />
                  )}
                  <span className={`font-semibold ${
                    scan.verdict === 'phishing' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {scan.verdict.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(scan._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 break-all">
                  <span className="font-medium">URL:</span> {scan.url}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">IP:</span> {scan.ip}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(scan.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanHistory; 