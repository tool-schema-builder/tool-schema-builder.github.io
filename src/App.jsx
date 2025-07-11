import React, { useState, useCallback, useRef } from 'react';

// --- Helper Icons ---
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);


// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="p-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Parameter Component ---
const Parameter = ({ parameter, onUpdate, onRemove }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ ...parameter, [field]: value });
  };

  const handleRequiredChange = (e) => {
    onUpdate({ ...parameter, required: e.target.checked });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
        aria-label="Remove Parameter"
      >
        <TrashIcon />
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Parameter Name</label>
          <input
            type="text"
            placeholder="e.g., city"
            value={parameter.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
          <select
            value={parameter.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition bg-white"
          >
            <option>string</option>
            <option>number</option>
            <option>boolean</option>
            <option>object</option>
            <option>array</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
        <textarea
          placeholder="e.g., The name of the city."
          value={parameter.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          rows="2"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Enum (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g., metric,imperial"
            value={parameter.enum.join(',')}
            onChange={(e) => handleInputChange('enum', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Default Value</label>
          <input
            type="text"
            placeholder="e.g., metric"
            value={parameter.default}
            onChange={(e) => handleInputChange('default', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${parameter.id}`}
          checked={parameter.required}
          onChange={handleRequiredChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor={`required-${parameter.id}`} className="ml-2 block text-sm text-gray-700">Required</label>
      </div>
    </div>
  );
};

// --- Tool Component ---
const Tool = ({ tool, onUpdate, onRemove }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ ...tool, [field]: value });
  };

  const addParameter = () => {
    const newParameter = {
      id: Date.now(),
      name: '',
      description: '',
      type: 'string',
      required: false,
      enum: [],
      default: ''
    };
    onUpdate({ ...tool, parameters: [...tool.parameters, newParameter] });
  };

  const updateParameter = (index, updatedParameter) => {
    const newParameters = [...tool.parameters];
    newParameters[index] = updatedParameter;
    onUpdate({ ...tool, parameters: newParameters });
  };

  const removeParameter = (index) => {
    const newParameters = tool.parameters.filter((_, i) => i !== index);
    onUpdate({ ...tool, parameters: newParameters });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-600 mb-1">Tool Name</label>
          <input
            type="text"
            placeholder="e.g., get_weather"
            value={tool.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full text-lg font-semibold px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <button
          onClick={onRemove}
          className="ml-4 mt-7 p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
          aria-label="Remove Tool"
        >
          <TrashIcon />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Tool Description</label>
        <textarea
          placeholder="e.g., Get the current weather for a specific city."
          value={tool.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          rows="3"
        ></textarea>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">Parameters</h3>
        <div className="space-y-4">
          {tool.parameters.map((param, index) => (
            <Parameter
              key={param.id}
              parameter={param}
              onUpdate={(updated) => updateParameter(index, updated)}
              onRemove={() => removeParameter(index)}
            />
          ))}
        </div>
        <button
          onClick={addParameter}
          className="mt-4 flex items-center gap-2 px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 hover:border-gray-500 transition-all"
        >
          <PlusIcon />
          Add Parameter
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [tools, setTools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const fileInputRef = useRef(null);

  const addTool = () => {
    const newTool = {
      id: Date.now(),
      name: '',
      description: '',
      parameters: [],
    };
    setTools([...tools, newTool]);
  };

  const updateTool = (index, updatedTool) => {
    const newTools = [...tools];
    newTools[index] = updatedTool;
    setTools(newTools);
  };

  const removeTool = (index) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const showErrorModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  // --- JSON Conversion Logic ---
  const convertToFinalJson = useCallback(() => {
    return tools.map(tool => {
      const properties = tool.parameters.reduce((acc, param) => {
        if (!param.name) return acc;
        acc[param.name] = {
          type: param.type,
          description: param.description,
        };
        if (param.enum.length > 0) {
          acc[param.name].enum = param.enum;
        }
        if (param.default) {
          acc[param.name].default = param.default;
        }
        return acc;
      }, {});

      const required = tool.parameters
        .filter(param => param.required && param.name)
        .map(param => param.name);

      return {
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: "object",
            properties: properties,
            ...(required.length > 0 && { required: required }),
          },
        },
      };
    });
  }, [tools]);

  const handleDownload = () => {
    const finalJson = convertToFinalJson();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalJson, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tool_schema.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        // Basic validation
        if (!Array.isArray(json)) {
            throw new Error("JSON must be an array.");
        }
        const newToolsState = json.map((tool, index) => {
            if (tool.type !== 'function' || !tool.function || !tool.function.name || !tool.function.parameters) {
                throw new Error(`Invalid structure for tool at index ${index}.`);
            }
            const { name, description, parameters } = tool.function;
            const requiredSet = new Set(parameters.required || []);
            
            const parsedParams = Object.entries(parameters.properties || {}).map(([paramName, paramDetails], paramIndex) => ({
                id: Date.now() + index + paramIndex,
                name: paramName,
                description: paramDetails.description || '',
                type: paramDetails.type || 'string',
                required: requiredSet.has(paramName),
                enum: paramDetails.enum || [],
                default: paramDetails.default || ''
            }));

            return {
                id: Date.now() + index,
                name: name,
                description: description || '',
                parameters: parsedParams
            };
        });
        setTools(newToolsState);
      } catch (error) {
        showErrorModal(`Invalid JSON Format: ${error.message}`);
      }
    };
    reader.onerror = () => {
        showErrorModal("Failed to read the file.");
    };
    reader.readAsText(file);
    // Reset file input to allow uploading the same file again
    event.target.value = null;
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Tool Schema Builder</h1>
          <p className="text-gray-600 mt-2">Create, edit, and export function-calling tool schemas for your models.</p>
        </header>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-wrap items-center justify-start gap-4">
          <button
            onClick={addTool}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
          >
            <PlusIcon />
            Add Tool
          </button>
          <button
            onClick={handleDownload}
            disabled={tools.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <DownloadIcon />
            Download JSON
          </button>
           <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-all shadow-sm"
          >
            <UploadIcon />
            Upload JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".json"
          />
        </div>

        <main className="space-y-6">
          {tools.length > 0 ? (
            tools.map((tool, index) => (
              <Tool
                key={tool.id}
                tool={tool}
                onUpdate={(updated) => updateTool(index, updated)}
                onRemove={() => removeTool(index)}
              />
            ))
          ) : (
            <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">No tools defined yet.</h2>
                <p className="text-gray-500 mt-2">Click "Add Tool" to get started!</p>
            </div>
          )}
        </main>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Notification">
        <p className="text-gray-600">{modalMessage}</p>
      </Modal>
    </div>
  );
}
