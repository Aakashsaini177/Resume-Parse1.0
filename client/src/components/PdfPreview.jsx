import React from "react";
import { getTempFileUrl } from "../services/api";

const PdfPreview = ({ tempId }) => {
  // Logic:
  // 1. If tempId is present -> Check if PDF. If PDF -> Show it. If not PDF -> Show "Not Available".
  // 2. If tempId is missing -> Show "sample.pdf" (Default).

  const isPdf = tempId ? tempId.toLowerCase().endsWith('.pdf') : true; // Default to true for sample.pdf
  const previewUrl = tempId ? `${getTempFileUrl(tempId)}#toolbar=0&navpanes=0&scrollbar=0` : "/sample.pdf#toolbar=0&navpanes=0&scrollbar=0";

  if (tempId && !isPdf) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Not Available</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          This file type cannot be previewed directly in the browser. The parsed data is available on the right.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-start bg-gray-50 rounded-xl overflow-hidden p-4">
      <iframe
        src={previewUrl}
        className="w-full max-w-[794px] h-full shadow-2xl border bg-white rounded-md"
        style={{
          aspectRatio: "1 / 1.414"
        }}
        title="Resume Preview"
        allow="fullscreen"
      ></iframe>
    </div>
  );
};

export default PdfPreview;
