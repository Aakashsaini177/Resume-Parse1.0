import { useState } from 'react';
import FileUpload from './components/FileUpload';
import UrlInput from './components/UrlInput';
import PdfPreview from './components/PdfPreview';
import ParsedOutput from './components/ParsedOutput';
import AtsScore from './components/AtsScore';
import { uploadResume, parseUrl } from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [tempId, setTempId] = useState(null);
  const [error, setError] = useState(null);
  const [showJSON, setShowJSON] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await uploadResume(file);
      setParsedData(data.parsed);
      setTempId(data.tempId);
    } catch (err) {
      console.error(err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlParse = async (url) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await parseUrl(url);
      setParsedData(data.parsed);
      setTempId(data.tempId);
    } catch (err) {
      console.error(err);
      setError('Failed to parse URL. Please check the link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!parsedData) return;

    const json = JSON.stringify((() => {
      const { cleanedText, ...rest } = parsedData;
      if (rest.links?.other) rest.links.other = [...new Set(rest.links.other)];
      return rest;
    })(), null, 2);

    try {
      await navigator.clipboard.writeText(json);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-10">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex-none mb-6 flex flex-col xl:flex-row justify-between items-center bg-white/70 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/40 shadow-sm ring-1 ring-slate-900/5 gap-6 xl:gap-0">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Resume Intelligence
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">AI PARSER & SCORER</p>
            </div>
          </div>

          {/* CENTER: Input Source Controls */}
          <div className="flex-1 w-full max-w-2xl px-4 flex flex-col gap-3">
             <div className="flex gap-3 items-stretch">
                <div className="flex-1">
                   <FileUpload onUpload={handleUpload} isLoading={isLoading} compact={true} />
                </div>
                <div className="w-px bg-gray-200 mx-2 hidden sm:block"></div>
                <div className="flex-1">
                   <UrlInput onParse={handleUrlParse} isLoading={isLoading} compact={true} />
                </div>
             </div>
             {error && (
                <div className="text-red-500 text-xs bg-red-50 border border-red-100 rounded px-2 py-1 text-center">
                  {error}
                </div>
              )}
          </div>

          {/* ATS Score */}
          <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
            {parsedData && <AtsScore score={parsedData.atsScore || 0} details={parsedData.atsDetails} />}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Preview - Width 6/12 */}
          <div className="lg:col-span-6 bg-white rounded-xl shadow p-3 flex flex-col h-[500px] lg:h-auto min-h-[500px]">
            <PdfPreview tempId={tempId} />
          </div>

          {/* RIGHT: Parsed Output - Width 6/12 */}
          <div className="lg:col-span-6 flex flex-col gap-4 h-full">
            {parsedData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full lg:h-auto lg:aspect-[1/1.414]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Analysis Result (JSON)
                  </h3>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all duration-200
                      ${isCopied 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50 hover:text-indigo-600'
                      }`}
                    title="Copy JSON to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied JSON
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy JSON
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 p-0 h-full overflow-hidden">
                  <div className="p-6 h-full">
                      <pre className="bg-slate-900 text-emerald-400 p-6 rounded-xl text-xs font-mono whitespace-pre-wrap break-words leading-relaxed overflow-auto shadow-inner border border-slate-800 h-full custom-scrollbar">
                      {JSON.stringify((() => {
                        const { cleanedText, ...rest } = parsedData;
                        if (rest.links?.other) rest.links.other = [...new Set(rest.links.other)];
                        return rest;
                      })(), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
