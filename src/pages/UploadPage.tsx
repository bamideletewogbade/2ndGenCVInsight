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
import { getApiKey, MAX_FILE_SIZE_MB } from '@/config/models';
import { ChevronDown, Sparkles, Key, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

export function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status, error, result, metrics, fallbackMessage, analyze, reset } = useAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [isFileValid, setIsFileValid] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jdOpen, setJdOpen] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    setApiKeyMissing(!getApiKey());
  }, []);

  // Navigate to dashboard on success
  useEffect(() => {
    if (status === 'success' && result && metrics) {
      navigate('/dashboard', { state: { result, metrics } });
    }
  }, [status, result, metrics, navigate]);

  // Show toast errors
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

  // API key missing card
  if (apiKeyMissing && status === 'idle') {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>API Key Not Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Create a <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">.env</code> file in the project root with:
              </p>
              <div className="bg-muted rounded-lg p-3">
                <code className="text-xs font-mono text-foreground">VITE_NVIDIA_API_KEY=your-key-here</code>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Get a free key at{' '}
                <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  build.nvidia.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // All models failed error
  if (status === 'error' && error && (error.type === 'all_models_failed' || error.type === 'json_failed')) {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Analysis Unavailable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {error.message}
                {error.type === 'json_failed' && ' The AI returned responses that couldn\'t be parsed. This is rare but can happen with complex resumes.'}
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
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
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <WifiOff className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>You Appear to Be Offline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {error.message}
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
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
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Text Extraction Failed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {error.message}
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { reset(); }} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
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
        <div className="w-full max-w-2xl space-y-6">
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

                {/* Optional Job Description */}
                {file && isFileValid && (
                  <Collapsible open={jdOpen} onOpenChange={setJdOpen}>
                    <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                      <ChevronDown className={`w-4 h-4 transition-transform ${jdOpen ? 'rotate-180' : ''}`} />
                      Add a target job description (optional)
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here to get tailored missing-skills analysis..."
                        className="w-full min-h-[120px] rounded-lg border border-gray-200 dark:border-gray-700 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {jobDescription.length.toLocaleString()} characters
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Analyze Button */}
                {file && isFileValid && (
                  <Button
                    onClick={handleAnalyze}
                    className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze
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