import { useState } from 'react';

const AtsScore = ({ score, details }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStyle = (score) => {
    if (score >= 80) return { bg: 'from-green-100 to-green-200', text: 'text-green-600', border: 'border-green-200' };
    if (score >= 50) return { bg: 'from-yellow-100 to-yellow-200', text: 'text-yellow-600', border: 'border-yellow-200' };
    return { bg: 'from-red-100 to-red-200', text: 'text-red-600', border: 'border-red-200' };
  };

  const style = getStyle(score);

  return (
    <>
      <div 
        onClick={() => setShowDetails(true)}
        className={`w-24 h-24 rounded-xl bg-gradient-to-br ${style.bg} border ${style.border} shadow-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
        title="Click for details"
      >
        <p className={`text-2xl font-bold ${style.text}`}>{score}/100</p>
        <p className={`text-[10px] font-medium uppercase opacity-80 ${style.text}`}>ATS Score</p>
        <p className="text-[9px] text-gray-500 mt-1">View Details</p>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className={`px-6 py-4 bg-gradient-to-r ${style.bg} flex justify-between items-center`}>
              <div>
                <h3 className={`text-lg font-bold ${style.text}`}>ATS Analysis</h3>
                <p className="text-xs text-gray-600">
                  Applied Domain: <span className="font-semibold">{details?.applied_domain || "General"}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-black/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* Missing Keywords (Critical) */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Missing Keywords (Actionable)
                </h4>
                {details?.missing_keywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {details.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-100 font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 italic">Great job! No critical keywords missing.</p>
                )}
              </div>

              {/* Matched Skills */}
              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Matched Skills
                </h4>
                {details?.matched_skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {details.matched_skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md border border-green-100 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No specific skills matched.</p>
                )}
              </div>

            </div>
            
            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Score calculated based on the <strong>{details?.applied_domain || "Default"}</strong> job profile.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AtsScore;
