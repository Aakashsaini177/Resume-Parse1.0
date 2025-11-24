import React, { useState } from "react";

const BACKEND_URL = "https://resume-parse1-0.onrender.com/parse";

const TABS = [
  "Overview",
  "Personal",
  "Education",
  "Experience",
  "Skills",
  "Projects",
  "Certifications",
  "Links",
];

function App() {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [showJson, setShowJson] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setData(null);
    setShowJson(false);

    if (!url.trim()) {
      setError("Please enter a resume URL.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Something went wrong");
      } else {
        setData(json.data);
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-5xl">
        {/* Input Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Resume Parser Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Paste a resume URL (PDF / DOCX from Google Drive, Dropbox, GitHub,
            etc.)
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3"
          >
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm"
              placeholder="Enter resume URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm"
            >
              {loading ? "Parsing..." : "Parse Resume"}
            </button>
          </form>

          {error && (
            <p className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
              {error}
            </p>
          )}
        </div>

        {/* PRO UI */}
        {data && !showJson && (
          <div className="bg-white shadow-lg rounded-2xl">
            {/* Tabs */}
            <div className="border-b border-slate-200 px-4 pt-3">
              <div className="flex flex-wrap gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="p-5">
              <TabContent tab={activeTab} data={data} />
            </div>
          </div>
        )}

        {/* SHOW JSON BUTTON */}
        {data && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-5 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-black"
            >
              {showJson ? "Hide JSON" : "View JSON Format"}
            </button>
          </div>
        )}

        {/* JSON VIEW BOX */}
        {showJson && data && (
          <pre className="mt-4 bg-slate-900 text-green-300 text-sm p-4 rounded-xl overflow-auto whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

/* ---------------- TAB CONTENT HANDLER ---------------- */

function TabContent({ tab, data }) {
  switch (tab) {
    case "Overview":
      return <OverviewTab data={data} />;
    case "Personal":
      return <PersonalTab data={data} />;
    case "Education":
      return <EducationTab data={data} />;
    case "Experience":
      return <ExperienceTab data={data} />;
    case "Skills":
      return <SkillsTab data={data} />;
    case "Projects":
      return <ProjectsTab data={data} />;
    case "Certifications":
      return <CertificationsTab data={data} />;
    case "Links":
      return <LinksTab data={data} />;
    default:
      return null;
  }
}

/* ---------------- TAB COMPONENTS ---------------- */

function OverviewTab({ data }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <Card title="Personal Overview">
        <InfoRow label="Name" value={data.name} />
        <InfoRow label="Email" value={data.email} />
        <InfoRow label="Phone" value={data.phone} />
        <InfoRow label="Location" value={data.location} />
      </Card>

      <Card title="Quick Summary">
        <InfoRow label="Education" value={data.education?.join(", ") || "—"} />
        <InfoRow label="Skills Count" value={data.skills?.length || 0} />
        <InfoRow label="Experience" value={data.experience ? "Yes" : "No"} />
        <InfoRow label="Projects" value={data.projects ? "Yes" : "No"} />
      </Card>
    </div>
  );
}

function PersonalTab({ data }) {
  return (
    <Card title="Personal Details">
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Phone" value={data.phone} />
      <InfoRow label="Location" value={data.location} />
    </Card>
  );
}

function EducationTab({ data }) {
  return (
    <Card title="Education">
      {data.education?.length ? (
        <ul className="list-disc list-inside space-y-1 text-slate-700">
          {data.education.map((deg, idx) => (
            <li key={idx}>{deg}</li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function ExperienceTab({ data }) {
  return (
    <Card title="Experience">
      {data.experience ? (
        <p className="whitespace-pre-wrap text-slate-700">{data.experience}</p>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function SkillsTab({ data }) {
  return (
    <Card title="Skills">
      {data.skills?.length ? (
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function ProjectsTab({ data }) {
  return (
    <Card title="Projects">
      {data.projects ? (
        <p className="whitespace-pre-wrap text-slate-700">{data.projects}</p>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function CertificationsTab({ data }) {
  const certs = data.certifications;
  return (
    <Card title="Certifications">
      {Array.isArray(certs) && certs.length ? (
        <ul className="list-disc list-inside space-y-1 text-slate-700">
          {certs.map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function LinksTab({ data }) {
  return (
    <Card title="Professional Links">
      {data.profile_links?.length ? (
        <ul className="space-y-2">
          {data.profile_links.map((link, idx) => (
            <li key={idx}>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Card({ title, children }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 shadow-sm">
      <h2 className="font-semibold text-slate-700 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 text-xs mb-1.5">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-slate-700 text-right">{value || "—"}</span>
    </div>
  );
}

function Empty() {
  return <p className="text-slate-400 text-sm">No data found.</p>;
}

export default App;
