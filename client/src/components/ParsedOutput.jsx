import React from 'react';

// --- Helper Components for Clean Code ---

const SectionTitle = ({ icon, title, color = "text-slate-800" }) => (
  <h4 className={`text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2 ${color}`}>
    {icon}
    {title}
  </h4>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/60 hover:bg-white/80 transition-colors rounded-xl p-5 border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
    {children}
  </span>
);

// --- Main Component ---

const ParsedOutput = ({ data }) => {
  if (!data) return null;

  // Destructure with fallbacks to prevent crashes
  const { 
    personal_info = {}, 
    skills = [], 
    education = [], 
    work_experience = [], 
    projects = [],
    summary = "" 
  } = data;

  return (
    <div className="space-y-6 pb-8">
      
      {/* 1. Header Card: Personal Info */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg shadow-slate-900/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{personal_info.name || "Candidate Name"}</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {personal_info.current_role || "Role Not Detected"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-300">
             {personal_info.email && (
               <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 {personal_info.email}
               </div>
             )}
             {personal_info.phone && (
               <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                 {personal_info.phone}
               </div>
             )}
             {personal_info.linkedin && (
               <a href={personal_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-[#0077b5]/20 text-[#9ccce8] hover:bg-[#0077b5]/40 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors">
                 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 LinkedIn
               </a>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (Summary, Skills, Education) - Width 1/3 */}
        <div className="space-y-6">
          
          {/* Summary */}
          {summary && (
            <Card>
              <SectionTitle 
                title="Profile Summary" 
                icon={<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
              />
              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                {summary}
              </p>
            </Card>
          )}

          {/* Skills */}
          <Card>
            <SectionTitle 
              title="Technical Skills" 
              icon={<svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Badge key={index}>{typeof skill === 'string' ? skill : skill.name}</Badge>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No skills extracted.</span>
              )}
            </div>
          </Card>

          {/* Education */}
          <Card>
             <SectionTitle 
              title="Education" 
              icon={<svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>}
            />
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-slate-100 last:pb-0">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-100 border border-emerald-300"></div>
                    <h5 className="text-sm font-bold text-slate-800">{edu.degree || "Degree"}</h5>
                    <p className="text-xs text-slate-500 font-medium mb-1">{edu.institution}</p>
                    <p className="text-xs text-slate-400">{edu.year}</p>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No education history found.</span>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (Experience & Projects) - Width 2/3 */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Work Experience */}
          <Card className="min-h-[300px]">
            <SectionTitle 
              title="Work Experience" 
              icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            
            <div className="space-y-8 mt-2">
              {work_experience.length > 0 ? (
                work_experience.map((job, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {job.job_title}
                        </h5>
                        <p className="text-sm font-semibold text-slate-500">
                          {job.company}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded">
                        {job.duration || "Dates N/A"}
                      </span>
                    </div>
                    
                    {/* Render bullet points if description is an array, else render text */}
                    <div className="text-sm text-slate-600 leading-relaxed pl-1">
                      {Array.isArray(job.responsibilities) ? (
                        <ul className="list-disc list-outside ml-4 space-y-1 marker:text-slate-300">
                          {job.responsibilities.map((res, rIdx) => (
                            <li key={rIdx}>{res}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{job.description || "No description provided."}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">No work experience detected.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Projects (Only render if exists) */}
          {projects.length > 0 && (
            <Card>
               <SectionTitle 
                title="Projects" 
                icon={<svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-purple-200 transition-colors">
                    <h5 className="font-bold text-slate-800 text-sm mb-2">{proj.name}</h5>
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ParsedOutput;
