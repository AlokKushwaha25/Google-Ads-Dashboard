
import React, { useRef } from 'react';

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  icon: React.ReactNode;
  fileName: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, accept, onFileSelect, disabled = false, icon, fileName }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
          disabled
            ? 'bg-gray-800 border-gray-700 cursor-not-allowed'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 cursor-pointer bg-gray-700/50'
        }`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
          {icon}
          <p className="mb-2 text-sm">
            <span className="font-semibold">{label}</span>
          </p>
          <p className="text-xs">{accept}</p>
        </div>
        <input id={id} type="file" className="hidden" accept={accept} onChange={handleFileChange} ref={inputRef} disabled={disabled} />
      </label>
      {fileName && (
        <p className="mt-2 text-xs text-center text-gray-400 truncate">
          Loaded: <span className="font-medium text-gray-300">{fileName}</span>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
