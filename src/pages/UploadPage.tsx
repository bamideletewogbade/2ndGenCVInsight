import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { DropZone } from '@/components/upload/DropZone';
import { FilePreview } from '@/components/upload/FilePreview';
import { AnalysisLoader } from '@/components/loading/AnalysisLoader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useAnalysis, type AnalysisStatus } from '@/hooks/useAnalysis';
import { useToast } from '@/hooks/use-toast';
import { MAX_FILE_SIZE_MB } from '@/config/models';
import { CaretDown, Warning, ArrowCounterClockwise, WifiSlash, ArrowUpRight } from '@phosphor-icons/react';

export function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status, error, result, metrics, fallbackMessage, analyze, reset } = useAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jdOpen, setJdOpen] = useState(false);

  useEffect(() => {
    if (status === 'success' && result && metrics) {
      navigate('/dashboard', { state: { result, metrics } });
    }
  }, [status, result, metrics, navigate]);

  useEffect(() => {
    if (error) {
      if (error.type === 'network') {
        toast({ title: 'Connection Error', description: error.message, variant: 'destructive' });
      }
    }
  }, [error, toast]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    reset();
    const ext = selectedFile.name.toLowerCase();
    const isValidType = ext.endsWith('.pdf') || ext.endsWith('.docx');
    const isValidSize = selectedFile.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

    setFile(selectedFile);
    setIsFileValid(isValidType && isValidSize);

    if (!isValidType) {
      toast({ title: 'Invalid File', description: 'Please upload a PDF or DOCX file.', variant: 'destructive' });
    } else if (!isValidSize) {
      toast({ title: 'File Too Large', description: `Please upload a file under ${MAX_FILE_SIZE_MB}MB.`, variant: 'destructive' });
    }
  }, [reset, toast]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setIsFileValid(false);
    reset();
  }, [reset]);

  const handleAnalyze = useCallback(() => {
    if (!file || !isFileValid) return;
    analyze(file, jobDescription.trim() || undefined);
  }, [file, isFileValid, analyze, jobDescription]);

  const isLoading = ['extracting', 'sending', 'analyzing', 'preparing'].includes(status);

  // All models failed
  if (status === 'error' && error && (error.type === 'all_models_failed' || error.type === 'json_failed')) {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Warning size={18} weight="regular" className="text-foreground/70" />
              </div>
              <CardTitle>Analysis Unavailable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {error.message}
                {error.type === 'json_failed' && ' The AI returned responses that couldn\'t be parsed.'}
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="rounded-full gap-1.5">
                  <ArrowCounterClockwise size={14} weight="bold" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // Server error
  if (status === 'error' && error && error.type === 'server') {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Warning size={18} weight="regular" className="text-foreground/70" />
              </div>
              <CardTitle>Server Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{error.message}</p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="rounded-full gap-1.5">
                  <ArrowCounterClockwise size={14} weight="bold" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // Network error
  if (status === 'error' && error && error.type === 'network') {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                <WifiSlash size={18} weight="regular" className="text-foreground/70" />
              </div>
              <CardTitle>Server Unreachable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{error.message}</p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="rounded-full gap-1.5">
                  <ArrowCounterClockwise size={14} weight="bold" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // Parse error
  if (status === 'error' && error && error.type === 'parse') {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Warning size={18} weight="regular" className="text-foreground/70" />
              </div>
              <CardTitle>Text Extraction Failed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{error.message}</p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="rounded-full gap-1.5">
                  <ArrowCounterClockwise size={14} weight="bold" />
                  Upload Different File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl space-y-6">
          {isLoading ? (
            <AnalysisLoader stage={status as Exclude<AnalysisStatus, 'idle' | 'success' | 'error'>} fallbackMessage={fallbackMessage} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!file ? (
                  <DropZone onFileSelect={handleFileSelect} disabled={isLoading} />
                ) : (
                  <FilePreview file={file} isValid={isFileValid} onRemove={handleRemoveFile} />
                )}

                {file && isFileValid && (
                  <Collapsible open={jdOpen} onOpenChange={setJdOpen}>
                    <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer">
                      <CaretDown size={12} weight="bold" className={`transition-transform ${jdOpen ? 'rotate-180' : ''}`} />
                      Add a target job description (optional)
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here to get tailored missing-skills analysis..."
                        className="w-full min-h-[120px] rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 resize-y focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5 text-right font-mono">
                        {jobDescription.length.toLocaleString()} chars
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {file && isFileValid && (
                  <Button
                    onClick={handleAnalyze}
                    className="w-full rounded-full gap-2 group"
                    size="lg"
                  >
                    Analyze
                    <ArrowUpRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}