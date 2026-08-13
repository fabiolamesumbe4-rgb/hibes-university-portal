import { useState } from "react";
import { FileText, Download, Loader2, CheckCircle2, Printer } from "lucide-react";

interface Document {
  id: string;
  title: string;
  format: string; // e.g. ".pdf"
  sizeKB: number;
  lastGenerated: string; // e.g. "Aug 10, 2026"
}

type DownloadState = "idle" | "generating" | "downloaded";


const INITIAL_DOCUMENTS: Document[] = [
  {
    id: "transcript",
    title: "Unofficial Academic Transcript",
    format: ".pdf",
    sizeKB: 240,
    lastGenerated: "Aug 9, 2026",
  },
  {
    id: "enrollment-letter",
    title: "Enrollment Verification Letter",
    format: ".pdf",
    sizeKB: 96,
    lastGenerated: "Jul 28, 2026",
  },
  {
    id: "fee-receipt",
    title: "Term Fee Receipt (Current Semester)",
    format: ".pdf",
    sizeKB: 134,
    lastGenerated: "Aug 1, 2026",
  },
  {
    id: "tax-1098t",
    title: "Tax Form 1098-T",
    format: ".pdf",
    sizeKB: 78,
    lastGenerated: "Jan 31, 2026",
  },
];

const GENERATION_DELAY_MS = 2000;


export default function DocumentDownloader() {
  const [documents] = useState<Document[]>(INITIAL_DOCUMENTS);

  
  const [downloadStatus, setDownloadStatus] = useState<Record<string, DownloadState>>({});

  const [printDoc, setPrintDoc] = useState<Document | null>(null);

  function handleDownload(doc: Document) {
    
    if (downloadStatus[doc.id] === "generating") return;

    setDownloadStatus((prev) => ({ ...prev, [doc.id]: "generating" }));

  
    setTimeout(() => {
      setDownloadStatus((prev) => ({ ...prev, [doc.id]: "downloaded" }));
      console.log(`Download complete: ${doc.title} (${doc.format}, ${doc.sizeKB} KB)`);
    }, GENERATION_DELAY_MS);
  }

  function handlePrintPreview(doc: Document) {
    setPrintDoc(doc);
    
    setTimeout(() => window.print(), 50);
  }

  return (
    <div className="mx-auto max-w-5xl">
      {}
      <div className="print:hidden">
        <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
          Document Center
        </h1>
        <p className="mt-1 text-sm text-[#6B5C7A]">
          Download official and unofficial documents as PDFs.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {documents.map((doc) => {
            const status = downloadStatus[doc.id] ?? "idle";

            return (
              <div
                key={doc.id}
                className="flex flex-col rounded-lg border border-[#E5D9F2] bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE3F9] text-[#3B1160]">
                    <FileText className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#3B1160]">
                      {doc.title}
                    </p>
                    <p className="mt-1 text-xs text-[#8A7A99]">
                      {doc.format.toUpperCase().replace(".", "")} · {doc.sizeKB} KB
                    </p>
                    <p className="mt-0.5 text-xs text-[#A896BB]">
                      Last generated: {doc.lastGenerated}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {}
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    disabled={status === "generating"}
                    className={[
                      "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
                      status === "downloaded"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : status === "generating"
                        ? "cursor-not-allowed bg-[#EFE3F9] text-[#3B1160]"
                        : "bg-[#3B1160] text-white hover:bg-[#2A0C46]",
                    ].join(" ")}
                  >
                    {status === "generating" && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating…
                      </>
                    )}
                    {status === "downloaded" && (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Downloaded!
                      </>
                    )}
                    {status === "idle" && (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    )}
                  </button>

                  {}
                  <button
                    type="button"
                    onClick={() => handlePrintPreview(doc)}
                    aria-label={`Print preview for ${doc.title}`}
                    className="flex items-center justify-center rounded-md border border-[#E5D9F2] p-2 text-[#6B5C7A] hover:bg-[#FAF7FD] hover:text-[#3B1160]"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      {printDoc && (
        <div className="hidden print:block">
          <div className="border-b border-black pb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black">
              Higher Institute of Business and Engineering Science, Buea
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">
              {printDoc.title}
            </h2>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-black">
            <div>
              <dt className="text-xs uppercase tracking-[0.1em] text-gray-600">
                File Format
              </dt>
              <dd className="mt-1">{printDoc.format}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.1em] text-gray-600">
                File Size
              </dt>
              <dd className="mt-1">{printDoc.sizeKB} KB</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.1em] text-gray-600">
                Last Generated
              </dt>
              <dd className="mt-1">{printDoc.lastGenerated}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.1em] text-gray-600">
                Printed On
              </dt>
              <dd className="mt-1">{new Date().toLocaleDateString()}</dd>
            </div>
          </dl>

          <p className="mt-8 text-xs text-gray-600">
            This is a system-generated preview sheet. For the official
            document, use the Download button on the Document Center page.
          </p>
        </div>
      )}
    </div>
  );
}
