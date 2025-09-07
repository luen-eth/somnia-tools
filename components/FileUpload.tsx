'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Recipient {
  address: string;
  amount: string;
}

interface FileUploadProps {
  onRecipientsLoaded: (recipients: Recipient[]) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onRecipientsLoaded, onError }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // File type check
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      onError('Please upload a .txt or .csv file');
      return;
    }

    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const recipients = parseFileContent(text);
      
      if (recipients.length === 0) {
        onError('No valid recipients found in file');
        return;
      }

      setProcessedCount(recipients.length);
      onRecipientsLoaded(recipients);
    } catch (error) {
      onError('Error processing file: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseFileContent = (content: string): Recipient[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const recipients: Recipient[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // CSV format: address,amount or address;amount
      const parts = line.split(/[,;]/).map(part => part.trim());
      
      if (parts.length !== 2) {
        console.warn(`Line ${i + 1} skipped: Invalid format`);
        continue;
      }

      const [address, amount] = parts;

      // Address format check
      if (!address.startsWith('0x') || address.length !== 42) {
        console.warn(`Line ${i + 1} skipped: Invalid address format`);
        continue;
      }

      // Amount check
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        console.warn(`Line ${i + 1} skipped: Invalid amount`);
        continue;
      }

      recipients.push({ address, amount });
    }

    return recipients;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setProcessedCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-500/10'
            : uploadedFile
            ? 'border-green-500 bg-green-500/10'
            : 'border-gray-600 hover:border-primary-500/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv"
          onChange={handleFileInput}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="space-y-3">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <div>
              <p className="text-green-400 font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-gray-400">
                {processedCount > 0 && `${processedCount} recipients loaded`}
              </p>
            </div>
            <Button
              onClick={clearFile}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4 mr-2" />
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-300 font-medium">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports .txt and .csv files (max 5MB)
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
        )}
      </div>

      {/* Format Example */}
      <div className="p-4 bg-dark-800/50 rounded-lg border border-gray-700">
        <div className="flex items-start space-x-2">
          <FileText className="w-5 h-5 text-primary-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">File Format:</p>
            <div className="text-xs font-mono text-gray-400 bg-dark-900 p-2 rounded">
              0x742d35Cc6634C0532925a3b8D39B5a4D4B7c4A5d,100<br />
              0x8ba1f109551bD432803012645Hac136c60B5d8F3,250.5<br />
              0x1234567890123456789012345678901234567890,50
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Each line: address,amount (comma or semicolon separated)
            </p>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-blue-400 text-sm">Processing file...</span>
          </div>
        </div>
      )}
    </div>
  );
}
