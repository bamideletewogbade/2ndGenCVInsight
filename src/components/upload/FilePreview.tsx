import { X, Check, FileText } from '@phosphor-icons/react';
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
    <div className="flex items-center gap-3 p-3 rounded-[var(--radius)] border border-border/60 bg-secondary/30">
      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-background border border-border/60">
        <FileText size={18} weight="regular" className="text-foreground/70" />
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
          <Check size={16} weight="bold" className="text-green-600 dark:text-green-400" />
        ) : (
          <X size={16} weight="bold" className="text-red-500" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <X size={12} weight="bold" />
        </button>
      </div>
    </div>
  );
}