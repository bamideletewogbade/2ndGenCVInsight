import { useCallback, useState } from 'react';
import { CloudArrowUp } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [disabled, onFileSelect]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  }, [disabled, onFileSelect]);

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileTap={!disabled ? { scale: 0.995 } : undefined}
      className={`
        relative cursor-pointer rounded-[var(--radius)] border border-dashed transition-all duration-200
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${isDragOver
          ? 'border-foreground bg-secondary'
          : 'border-border hover:border-foreground/20'
        }
      `}
    >
      <div className="flex flex-col items-center gap-4 py-16">
        <CloudArrowUp
          size={32}
          weight={isDragOver ? 'fill' : 'regular'}
          className={`transition-colors ${isDragOver ? 'text-foreground' : 'text-muted-foreground/50'}`}
        />
        <div className="text-center">
          <p className="text-[13px] font-medium text-foreground">
            {isDragOver ? 'Drop here' : 'Drop your resume, or click to browse'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">PDF, DOCX</p>
        </div>
      </div>
    </motion.div>
  );
}