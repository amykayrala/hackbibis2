import { useState, useEffect } from "react";
import { useGlobalAction } from "@gadgetinc/react";
import { api } from "../api";
import subwayGif from "../components/assets/subway.gif";

const ALLOWED_TYPES = ["text/plain", "application/json", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [showLoadingGif, setShowLoadingGif] = useState(false);
  const [{ data, error, fetching }, upload] = useGlobalAction(api.uploadFile);

  useEffect(() => {
    if (data) {
      setStatus({
        type: data.success ? "success" : "error",
        message: data.success ? 
          `Successfully processed ${data.result?.successfulRecords || 0} breach records from uploaded file` :
          data.errors?.length ? 
            data.errors.map(err => err.message).join(", ") :
            "Upload failed",
      });
      const timer = setTimeout(() => setStatus({ type: null, message: "" }), 30000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setStatus({
        type: "error",
        message: error.message || "An unexpected error occurred during upload",
      });
      const timer = setTimeout(() => setStatus({ type: null, message: "" }), 30000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    let loadingTimer;
    if (fetching) {
      loadingTimer = setTimeout(() => {
        setShowLoadingGif(true);
      }, 5000);
    } else {
      setShowLoadingGif(false);
    }
    return () => {
      if (loadingTimer) clearTimeout(loadingTimer);
    };
  }, [fetching]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setStatus({ type: null, message: "" });
    setValidationError("");

    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setValidationError("Invalid file type. Please upload a valid file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || validationError) return;

    try {
      const base64DataUrl = await fileToBase64(selectedFile);
      // Remove the data URL prefix (e.g. "data:text/plain;base64,")
      const base64String = base64DataUrl.split(',')[1];
      
      await upload({ file: base64String });
      
      // Reset form state
      setSelectedFile(null);
      event.target.reset();
    } catch (err) {
      setStatus({
        type: "error",
        message: "Failed to process file: " + (err.message || "Unknown error"),
      });
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="upload-container" style={{ maxWidth: "400px", width: "100%", padding: "2rem", border: "1px solid #000", borderRadius: "16px", backgroundColor: "#FF69B4", boxShadow: "4px 4px 0px 0px #000", color: "#000", textAlign: "center" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Upload</h1>
        <p style={{ marginBottom: "1rem", color: "#000", fontSize: "1rem" }}>Upload your data in .json, .excel, or .txt format!</p>
        <form onSubmit={handleSubmit} aria-label="Upload data">
          <div style={{ marginBottom: "1.5rem" }}>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={fetching}
              accept=".txt,.json,.xlsx.xls"
              aria-describedby={validationError ? "error-message" : undefined}
              aria-invalid={!!validationError}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 1rem auto",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #000",
                borderRadius: "8px",
                color: "#000",
                backgroundColor: "#fff",
              }}
            />
          </div>
          {validationError && <div id="error-message" role="alert" style={{ color: "#000", marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f8d7da", borderRadius: "8px", boxShadow: "2px 2px 0px 0px #000" }}>{validationError}</div>}          
          <button 
            aria-busy={fetching}
            type="submit"
            disabled={!selectedFile || fetching}>
            {fetching ? "Uploading..." : "Upload Records"}
          </button>
        </form>
        {status.type && <div role="status" aria-live="polite" style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px", backgroundColor: status.type === "success" ? "#d4edda" : "#f8d7da", color: "#000", border: "1px solid #000", boxShadow: "2px 2px 0px 0px #000" }}>{status.message}</div> }
        {showLoadingGif && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000
          }}>
            <img src={subwayGif} alt="Loading..." style={{ width: "400px", height: "auto" }} />
          </div>
        )}
      </div>
    </div>
  );
}