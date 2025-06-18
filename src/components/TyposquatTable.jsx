import { FiInfo } from 'react-icons/fi';

const sampleData = [
  {
    url: 'amazonn.com',
    ip: '192.168.1.1',
    ns: 'ns1.example.com',
    category: 'E-commerce',
    urlType: 'Ajout de lettre',
    mxRecords: 'mail.example.com',
    risk: 85,
    scanVerdict: 'Malveillant',
    takedownStatus: 'En cours'
  },
  {
    url: 'amazun.com',
    ip: '192.168.1.2',
    ns: 'ns2.example.com',
    category: 'E-commerce',
    urlType: 'Substitution de lettre',
    mxRecords: 'mail2.example.com',
    risk: 65,
    scanVerdict: 'Suspect',
    takedownStatus: 'En attente'
  }
];

const RiskBar = ({ value }) => {
  const getColor = (value) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${getColor(value)} h-2.5 rounded-full`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default function TyposquatTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresse IP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Serveur de noms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type de construction
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Enregistrements MX
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Verdict de scan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut de retrait
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sampleData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.url}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.ip}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.ns}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.urlType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.mxRecords}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-24">
                  <RiskBar value={row.risk} />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.scanVerdict === 'Malveillant'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {row.scanVerdict}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.takedownStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 