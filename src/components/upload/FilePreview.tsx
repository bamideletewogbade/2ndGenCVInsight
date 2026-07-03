import { X, CheckCircle2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilePreviewProps {
  file: File;
  isValid: boolean;
  onRemove: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePreview({ file, isValid, onRemove }: FilePreviewProps) {
  const ext = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
          <Badge variant="outline" className="text-[10px]">{ext}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <X className="w-5 h-5 text-red-500" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}