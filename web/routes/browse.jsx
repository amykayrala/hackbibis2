import { useFindMany, useGlobalAction } from "@gadgetinc/react";
import { api } from "../api";
import React, { useState, useCallback } from "react";

export default function BrowseBreachRecords() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const filter = searchQuery
    ? {
        OR: [
          { url: { startsWith: searchQuery } },
          { username: { startsWith: searchQuery } },
          { domain: { startsWith: searchQuery } },
          { tags: { startsWith: searchQuery } },
          { path: { startsWith: searchQuery } },
          { httpTitle: { startsWith: searchQuery } },
          { ipAddress: { startsWith: searchQuery } },
        ],
      }
    : undefined;

  const [{ fetching: enriching, error: enrichError }, enrichRecords] = useGlobalAction(api.enrichPendingRecords);

  const [{ data, fetching, error }] = useFindMany(api.BreachRecord, {
    sort: { createdAt: "Descending" },
    filter,
  });

  if (fetching) {
    return (
      <div style={{ 
        height: "calc(100vh - 4rem)", 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden",
        padding: "2rem" 
      }}>
        <h1 style={{ marginBottom: "2rem" }}>Database</h1>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
          <button
            onClick={() => enrichRecords()}
            disabled={enriching}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              backgroundColor: enriching ? "#eee" : "#fff",
              cursor: enriching ? "not-allowed" : "pointer",
            }}
          >
            {enriching ? "Enriching..." : "Enrich Pending Records"}
          </button>
          {enrichError && <span style={{ color: "#ef4444" }}>Error: {enrichError.message}</span>}
          <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search records..."
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "100%",
          }}
        />
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          Loading breach records...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        Error loading breach records: {error.message}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div style={{ 
        height: "calc(100vh - 4rem)", 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden",
        padding: "2rem" 
      }}>
        <h1 style={{ marginBottom: "2rem" }}>Database</h1>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
          <button
            onClick={() => enrichRecords()}
            disabled={enriching}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              backgroundColor: enriching ? "#eee" : "#fff",
              cursor: enriching ? "not-allowed" : "pointer",
            }}
          >
            {enriching ? "Enriching..." : "Enrich Pending Records"}
          </button>
          {enrichError && <span style={{ color: "#ef4444" }}>Error: {enrichError.message}</span>}
          <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search records..."
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "100%",
          }}
        />
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          No breach records found.
        </div>
      </div>
    );
  }

  return (
    <div style={{
       height: "calc(100vh - 4rem)", 
       display: "flex", 
       flexDirection: "column", 
       overflow: "hidden",
       padding: "2rem" 
     }}>
       <h1 style={{ marginBottom: "2rem" }}>Database</h1>
       <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
         <button
           onClick={() => enrichRecords()}
           disabled={enriching}
           style={{
             padding: "0.5rem 1rem",
             borderRadius: "4px",
             border: "1px solid #ddd",
             backgroundColor: enriching ? "#eee" : "#fff",
             cursor: enriching ? "not-allowed" : "pointer",
           }}
         >
           {enriching ? "Enriching..." : "Enrich Pending Records"}
         </button>
         {enrichError && <span style={{ color: "#ef4444" }}>Error: {enrichError.message}</span>}
         <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search records..."
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "100%",
          }}
        />
       </div>
       <div style={{ overflowY: "auto", flexGrow: 1, marginRight: "-0.5rem", paddingRight: "0.5rem" }}>
       <div
         style={{
         display: "grid",
         gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
         gap: "1rem",
       }}>
        {data.map((record) => (
          <div
            key={record.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "white",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>{record.domain || "Unknown Domain"}</h3>
            
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>URL:</strong> {record.url || "N/A"}
            </div>
            
            {(record.username || record.password) && (
              <div style={{ marginBottom: "0.5rem" }}>
                {record.username && <div><strong>Username:</strong> {record.username}</div>}
                {record.password && <div><strong>Password:</strong> {record.password}</div>}
              </div>
            )}
            
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  backgroundColor: record.isResolved ? "#4ade80" : "#f87171",
                  color: "white",
                }}
              >
                {record.isResolved ? "Resolved" : "Unresolved"}
              </span>
              
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  backgroundColor: record.needsEnrichment ? "#facc15" : "#4ade80",
                  color: "white",
                }}
              >
                {record.needsEnrichment ? "Needs Enrichment" : "Enriched"}
              </span>
            </div>
            
            <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}>
              Created: {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
