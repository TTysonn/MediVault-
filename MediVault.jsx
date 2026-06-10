/**
 * MediVault - AI-powered Healthcare Document Management System
 * Complete frontend implementation using React + Tailwind CSS
 *
 * Architecture:
 * - Single-file React component with internal routing via state
 * - Mock data for demonstration
 * - Modular component structure with clear separation of concerns
 * - Tailwind CSS for all styling
 * - Responsive for desktop, tablet, and mobile
 */

import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const MOCK_USER = {
  id: "u1",
  name: "Ananya Sharma",
  email: "ananya.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "AS",
};

const CATEGORIES = [
  "Admission Certificate",
  "ICU Document",
  "Prescription",
  "Lab Report",
  "Discharge Summary",
  "Insurance Document",
  "Medical Leave Certificate",
  "Other",
];

const MOCK_DOCUMENTS = [
  {
    id: "d1",
    title: "Discharge Summary – Apollo Hospital",
    category: "Discharge Summary",
    hospital: "Apollo Hospitals, Mumbai",
    dateIssued: "2024-11-15",
    uploadDate: "2024-11-18",
    size: "1.2 MB",
    type: "pdf",
    extractedInfo: {
      dates: ["Admission: Nov 10, 2024", "Discharge: Nov 15, 2024"],
      doctors: ["Dr. Priya Menon (Cardiologist)", "Dr. Arjun Rao (Intensivist)"],
      patientStatus: "Stable – discharged with medication",
      notes: "Patient admitted with acute chest pain. Cardiac enzymes normalised on Day 3. Echocardiogram unremarkable. Follow-up in 2 weeks.",
    },
  },
  {
    id: "d2",
    title: "ICU Admission Record",
    category: "ICU Document",
    hospital: "Apollo Hospitals, Mumbai",
    dateIssued: "2024-11-10",
    uploadDate: "2024-11-18",
    size: "850 KB",
    type: "pdf",
    extractedInfo: {
      dates: ["ICU Admission: Nov 10, 2024", "ICU Discharge: Nov 12, 2024"],
      doctors: ["Dr. Arjun Rao (Intensivist)"],
      patientStatus: "Critical – stabilised on Day 2",
      notes: "Admitted to ICU with severe chest pain and elevated troponins. Placed on continuous cardiac monitoring.",
    },
  },
  {
    id: "d3",
    title: "Cardiology Lab Report",
    category: "Lab Report",
    hospital: "Apollo Hospitals, Mumbai",
    dateIssued: "2024-11-11",
    uploadDate: "2024-11-18",
    size: "540 KB",
    type: "pdf",
    extractedInfo: {
      dates: ["Sample collected: Nov 11, 2024"],
      doctors: ["Dr. Kavita Desai (Pathologist)"],
      patientStatus: "Troponin-I elevated (2.3 ng/mL)",
      notes: "Complete cardiac panel. Troponin-I: 2.3 ng/mL (high). BNP: 450 pg/mL (high). Other markers within normal range.",
    },
  },
  {
    id: "d4",
    title: "Insurance Claim Form – Star Health",
    category: "Insurance Document",
    hospital: "Star Health Insurance",
    dateIssued: "2024-11-20",
    uploadDate: "2024-11-21",
    size: "320 KB",
    type: "pdf",
    extractedInfo: {
      dates: ["Claim filed: Nov 20, 2024"],
      doctors: [],
      patientStatus: "Claim pending review",
      notes: "Claim #SH20241120-4471. Hospitalisation benefit claimed for 5 nights. Supporting documents attached.",
    },
  },
  {
    id: "d5",
    title: "Medical Leave Certificate",
    category: "Medical Leave Certificate",
    hospital: "Apollo Hospitals, Mumbai",
    dateIssued: "2024-11-15",
    uploadDate: "2024-11-22",
    size: "210 KB",
    type: "pdf",
    extractedInfo: {
      dates: ["Leave period: Nov 10 – Nov 30, 2024"],
      doctors: ["Dr. Priya Menon"],
      patientStatus: "Rest advised for 15 days post-discharge",
      notes: "Patient advised complete bed rest for 15 days. Cleared to return to light duty from December 1, 2024.",
    },
  },
  {
    id: "d6",
    title: "Prescription – Post-discharge Medications",
    category: "Prescription",
    hospital: "Apollo Hospitals, Mumbai",
    dateIssued: "2024-11-15",
    uploadDate: "2024-11-18",
    size: "180 KB",
    type: "jpg",
    extractedInfo: {
      dates: ["Prescribed: Nov 15, 2024"],
      doctors: ["Dr. Priya Menon"],
      patientStatus: "Ongoing medication required",
      notes: "Aspirin 75mg OD, Metoprolol 25mg BD, Atorvastatin 40mg OD, Pantoprazole 40mg OD. Review after 2 weeks.",
    },
  },
];

const MOCK_ALERTS = [
  {
    id: "a1",
    severity: "High",
    title: "Conflicting Patient Status",
    documents: ["Discharge Summary – Apollo Hospital", "ICU Admission Record"],
    explanation:
      "The Discharge Summary (Nov 15) indicates the patient was stable at discharge, but a separate ICU Admission Record suggests the patient was in critical condition on the same date of discharge. These statuses appear contradictory and may indicate a data entry error.",
    reviewed: false,
  },
  {
    id: "a2",
    severity: "Medium",
    title: "Date Mismatch in ICU Record",
    documents: ["ICU Admission Record", "Cardiology Lab Report"],
    explanation:
      "The ICU record shows admission on Nov 10 and discharge from ICU on Nov 12, but the Lab Report dated Nov 11 lists the patient status as 'Critical – Troponin-I elevated', which is inconsistent with ICU discharge timeline.",
    reviewed: false,
  },
  {
    id: "a3",
    severity: "Low",
    title: "Missing Supporting Document for Insurance Claim",
    documents: ["Insurance Claim Form – Star Health"],
    explanation:
      "The insurance claim references an Admission Certificate as a supporting document, but no Admission Certificate has been uploaded to MediVault. Consider uploading it to complete the claim package.",
    reviewed: true,
  },
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", message: "Discharge Summary uploaded successfully.", time: "2 hours ago", read: false, icon: "upload" },
  { id: "n2", message: "AI verification detected 2 new alerts.", time: "2 hours ago", read: false, icon: "alert" },
  { id: "n3", message: "Emergency package generated for Insurance Claim.", time: "1 day ago", read: true, icon: "package" },
  { id: "n4", message: "Lab Report uploaded successfully.", time: "2 days ago", read: true, icon: "upload" },
  { id: "n5", message: "ICU Document verified by AI.", time: "3 days ago", read: true, icon: "check" },
];

const MOCK_ACTIVITY = [
  { id: "act1", type: "upload", message: "Medical Leave Certificate uploaded", time: "Nov 22, 2024" },
  { id: "act2", type: "upload", message: "Insurance Claim Form uploaded", time: "Nov 21, 2024" },
  { id: "act3", type: "alert", message: "AI verification alert generated", time: "Nov 18, 2024" },
  { id: "act4", type: "upload", message: "5 documents uploaded", time: "Nov 18, 2024" },
  { id: "act5", type: "package", message: "Emergency package generated", time: "Nov 17, 2024" },
];

// ─────────────────────────────────────────────
// ICON COMPONENTS (inline SVG, no dependencies)
// ─────────────────────────────────────────────

const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    documents: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    package: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    eye: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
    eyeoff: <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
    chevronright: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
    chevronleft: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    list: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    hospital: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    arrowback: <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      {icons[name] || null}
    </svg>
  );
};

// ─────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────

/** Pill badge for categories */
const Badge = ({ label, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    high: "bg-red-100 text-red-700 font-semibold",
    medium: "bg-amber-100 text-amber-700 font-semibold",
    low: "bg-blue-100 text-blue-700 font-semibold",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${variants[variant] || variants.default}`}>
      {label}
    </span>
  );
};

/** Category → badge color map */
const categoryColor = (cat) => {
  const map = {
    "Admission Certificate": "blue",
    "ICU Document": "red",
    "Prescription": "teal",
    "Lab Report": "teal",
    "Discharge Summary": "green",
    "Insurance Document": "amber",
    "Medical Leave Certificate": "blue",
    "Other": "default",
  };
  return map[cat] || "default";
};

/** Modal dialog wrapper */
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Confirmation dialog */
const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="text-slate-600 mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm">
        Cancel
      </button>
      <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium text-sm">
        Delete
      </button>
    </div>
  </Modal>
);

/** Generic card wrapper */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

/** Primary button */
const PrimaryBtn = ({ children, onClick, className = "", disabled = false, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);

/** Secondary/ghost button */
const SecondaryBtn = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition-colors ${className}`}
  >
    {children}
  </button>
);

// ─────────────────────────────────────────────
// SIDEBAR / NAV
// ─────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "upload", label: "Upload Documents", icon: "upload" },
  { id: "documents", label: "My Documents", icon: "documents" },
  { id: "verification", label: "AI Verification", icon: "shield" },
  { id: "emergency", label: "Emergency Packages", icon: "package" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "profile", label: "Profile", icon: "user" },
];

const Sidebar = ({ currentPage, setPage, collapsed, setCollapsed, unreadCount }) => (
  <aside
    className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-slate-100 shadow-sm transition-all duration-300 z-30 ${
      collapsed ? "w-16" : "w-60"
    }`}
  >
    {/* Logo */}
    <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
      </div>
      {!collapsed && <span className="font-bold text-slate-800 text-lg tracking-tight">MediVault</span>}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`ml-auto p-1 rounded-lg hover:bg-slate-100 text-slate-400 ${collapsed ? "hidden" : ""}`}
      >
        <Icon name="chevronleft" className="w-4 h-4" />
      </button>
    </div>

    {/* Expand button when collapsed */}
    {collapsed && (
      <button onClick={() => setCollapsed(false)} className="mx-auto mt-2 p-2 rounded-lg hover:bg-slate-100 text-slate-400">
        <Icon name="menu" className="w-4 h-4" />
      </button>
    )}

    {/* Nav items */}
    <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
            currentPage === item.id
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          }`}
          title={collapsed ? item.label : ""}
        >
          <Icon name={item.icon} className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{item.label}</span>}
          {item.id === "notifications" && unreadCount > 0 && (
            <span className={`flex-shrink-0 ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${collapsed ? "absolute top-1 right-1" : ""}`}>
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </nav>

    {/* User chip */}
    <div className="p-3 border-t border-slate-100">
      <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {MOCK_USER.avatar}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-700 truncate">{MOCK_USER.name}</div>
            <div className="text-xs text-slate-400 truncate">{MOCK_USER.email}</div>
          </div>
        )}
      </div>
    </div>
  </aside>
);

/** Mobile bottom nav */
const BottomNav = ({ currentPage, setPage, unreadCount }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-30 flex">
    {NAV_ITEMS.slice(0, 5).map((item) => (
      <button
        key={item.id}
        onClick={() => setPage(item.id)}
        className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium relative ${
          currentPage === item.id ? "text-blue-600" : "text-slate-400"
        }`}
      >
        <div className="relative">
          <Icon name={item.icon} className="w-5 h-5" />
          {item.id === "notifications" && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="leading-none">{item.label.split(" ")[0]}</span>
      </button>
    ))}
  </nav>
);

// ─────────────────────────────────────────────
// PAGE: LOGIN
// ─────────────────────────────────────────────

const LoginPage = ({ onLogin, setPage }) => {
  const [email, setEmail] = useState("ananya.sharma@email.com");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg mb-4">
            <Icon name="documents" className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to MediVault</h1>
          <p className="text-slate-500 mt-1 text-sm">Your secure healthcare document hub</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                <Icon name="alert" className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <Icon name={showPw ? "eyeoff" : "eye"} className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
            </div>
            <PrimaryBtn type="submit" disabled={loading} className="w-full justify-center py-3">
              {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </PrimaryBtn>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{" "}
            <button onClick={() => setPage("register")} className="text-blue-600 font-medium hover:text-blue-700">Create account</button>
          </p>
        </Card>

        {/* Demo hint */}
        <p className="text-center text-xs text-slate-400 mt-4">Demo: credentials pre-filled — just click Sign in</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: REGISTER
// ─────────────────────────────────────────────

const RegisterPage = ({ onLogin, setPage }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg mb-4">
            <Icon name="documents" className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm">Join MediVault to manage your health records</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full name", type: "text", placeholder: "Ananya Sharma" },
              { key: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
              { key: "phone", label: "Mobile number", type: "tel", placeholder: "+91 98765 43210" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={update(key)} placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name={showPw ? "eyeoff" : "eye"} className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
              <input type="password" value={form.confirm} onChange={update("confirm")} placeholder="Re-enter your password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
            </div>
            <PrimaryBtn type="submit" disabled={loading} className="w-full justify-center py-3 mt-2">
              {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {loading ? "Creating account…" : "Create account"}
            </PrimaryBtn>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <button onClick={() => setPage("login")} className="text-blue-600 font-medium hover:text-blue-700">Sign in</button>
          </p>
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────

const DashboardPage = ({ setPage, documents, alerts, notifications }) => {
  const unreviewed = alerts.filter((a) => !a.reviewed).length;
  const stats = [
    { label: "Documents", value: documents.length, icon: "documents", color: "blue", sub: "total uploaded" },
    { label: "Recent Uploads", value: 5, icon: "upload", color: "teal", sub: "this month" },
    { label: "Inconsistency Alerts", value: unreviewed, icon: "alert", color: "amber", sub: "need review" },
    { label: "Emergency Packages", value: 1, icon: "package", color: "emerald", sub: "generated" },
  ];

  const colorMap = {
    blue: { card: "bg-blue-50", icon: "text-blue-600", num: "text-blue-700" },
    teal: { card: "bg-teal-50", icon: "text-teal-600", num: "text-teal-700" },
    amber: { card: "bg-amber-50", icon: "text-amber-600", num: "text-amber-700" },
    emerald: { card: "bg-emerald-50", icon: "text-emerald-600", num: "text-emerald-700" },
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm font-medium">Good morning</p>
        <h2 className="text-2xl font-bold mt-0.5">{MOCK_USER.name}</h2>
        <p className="text-blue-100 text-sm mt-1">Your health records are secure and organised.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const c = colorMap[s.color];
          return (
            <Card key={s.label} className={`p-4 ${c.card} border-0`}>
              <div className={`${c.icon} mb-2`}><Icon name={s.icon} className="w-6 h-6" /></div>
              <div className={`text-2xl font-bold ${c.num}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
              <div className="text-xs text-slate-400">{s.sub}</div>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Upload Document", icon: "upload", page: "upload", color: "bg-blue-600 text-white hover:bg-blue-700" },
            { label: "View Documents", icon: "documents", page: "documents", color: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" },
            { label: "Emergency Package", icon: "package", page: "emergency", color: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" },
            { label: "AI Alerts", icon: "shield", page: "verification", color: unreviewed > 0 ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" },
          ].map((a) => (
            <button key={a.label} onClick={() => setPage(a.page)}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl font-medium text-sm transition-colors ${a.color}`}>
              <Icon name={a.icon} className="w-5 h-5" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity + Recent docs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Recent Activity</h3>
          <div className="relative space-y-0">
            {MOCK_ACTIVITY.map((act, i) => (
              <div key={act.id} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    act.type === "upload" ? "bg-blue-100 text-blue-600" :
                    act.type === "alert" ? "bg-amber-100 text-amber-600" :
                    "bg-emerald-100 text-emerald-600"
                  }`}>
                    <Icon name={act.type === "upload" ? "upload" : act.type === "alert" ? "alert" : "package"} className="w-4 h-4" />
                  </div>
                  {i < MOCK_ACTIVITY.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 mt-1.5" />}
                </div>
                <div className="pt-1.5 pb-2">
                  <p className="text-sm text-slate-700 font-medium">{act.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent documents */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Recent Documents</h3>
            <button onClick={() => setPage("documents")} className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Icon name="file" className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-400">{doc.hospital}</p>
                </div>
                <Badge label={doc.category} variant={categoryColor(doc.category)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: UPLOAD DOCUMENTS
// ─────────────────────────────────────────────

const UploadPage = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ title: "", hospital: "", date: "", category: "" });
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(f.type)
    );
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpload = () => {
    if (!files.length) return;
    setUploading(true); setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setUploading(false); setDone(true); onUpload && onUpload(); return 100; }
        return p + 10;
      });
    }, 150);
  };

  const reset = () => { setFiles([]); setDone(false); setProgress(0); setForm({ title: "", hospital: "", date: "", category: "" }); };

  if (done) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
        <Icon name="check" className="w-8 h-8 text-emerald-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">Upload Complete!</h2>
      <p className="text-slate-500 mt-2 text-sm">{files.length} file{files.length !== 1 ? "s" : ""} uploaded successfully and queued for AI verification.</p>
      <PrimaryBtn onClick={reset} className="mt-6">Upload more documents</PrimaryBtn>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Upload Documents</h2>
        <p className="text-sm text-slate-500 mt-1">Add your medical records — PDFs, JPG, and PNG files are supported.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
        }`}
      >
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileInput} className="hidden" />
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Icon name="upload" className="w-6 h-6" />
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700">Drag files here, or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">PDF, JPG, JPEG, PNG — up to 10 files at once</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <Card className="p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-600 mb-3">{files.length} file{files.length !== 1 ? "s" : ""} selected</p>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
              <Icon name="file" className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-slate-700 flex-1 truncate">{f.name}</span>
              <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-slate-400 hover:text-red-500">
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </Card>
      )}

      {/* Document metadata */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-slate-700">Document Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Document title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Discharge Summary – Apollo"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hospital / Issuing authority</label>
            <input type="text" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })}
              placeholder="e.g. Apollo Hospitals, Mumbai"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of issue</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-slate-400 font-normal">(optional)</span></label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50">
              <option value="">Auto-detect category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Uploading…</span><span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <PrimaryBtn onClick={handleUpload} disabled={!files.length || uploading}>
          <Icon name="upload" className="w-4 h-4" />
          {uploading ? "Uploading…" : "Upload Documents"}
        </PrimaryBtn>
        <SecondaryBtn onClick={reset}>Cancel</SecondaryBtn>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: MY DOCUMENTS
// ─────────────────────────────────────────────

const DocumentsPage = ({ documents, setDocuments, setSelectedDoc, setPage }) => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [sort, setSort] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPageNum] = useState(1);
  const PER_PAGE = 6;

  const filtered = documents
    .filter((d) => (!search || d.title.toLowerCase().includes(search.toLowerCase()) || d.hospital.toLowerCase().includes(search.toLowerCase())))
    .filter((d) => (!filterCat || d.category === filterCat))
    .sort((a, b) => sort === "newest" ? new Date(b.uploadDate) - new Date(a.uploadDate) : new Date(a.uploadDate) - new Date(b.uploadDate));

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleDelete = () => {
    setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const openDoc = (doc) => { setSelectedDoc(doc); setPage("docdetail"); };

  const DocCard = ({ doc }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
          <Icon name="file" className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">{doc.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{doc.hospital}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <Badge label={doc.category} variant={categoryColor(doc.category)} />
        <span className="text-xs text-slate-400">{doc.uploadDate}</span>
      </div>
      <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
        <button onClick={() => openDoc(doc)} title="View" className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600">
          <Icon name="eye" className="w-3.5 h-3.5" /> View
        </button>
        <button title="Download" className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-teal-50 hover:text-teal-600">
          <Icon name="download" className="w-3.5 h-3.5" /> Save
        </button>
        <button title="Share" className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100">
          <Icon name="share" className="w-3.5 h-3.5" /> Share
        </button>
        <button onClick={() => setDeleteTarget(doc.id)} title="Delete" className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-red-50 hover:text-red-600">
          <Icon name="trash" className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </Card>
  );

  const DocRow = ({ doc }) => (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
        <Icon name="file" className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700 truncate">{doc.title}</p>
        <p className="text-xs text-slate-400 truncate">{doc.hospital}</p>
      </div>
      <Badge label={doc.category} variant={categoryColor(doc.category)} />
      <span className="text-xs text-slate-400 hidden sm:block w-24 text-right">{doc.uploadDate}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => openDoc(doc)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Icon name="eye" className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600"><Icon name="download" className="w-4 h-4" /></button>
        <button onClick={() => setDeleteTarget(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Icon name="trash" className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Documents</h2>
          <p className="text-sm text-slate-500 mt-0.5">{documents.length} records stored</p>
        </div>
        <PrimaryBtn onClick={() => setPage("upload")}><Icon name="plus" className="w-4 h-4" /> Upload</PrimaryBtn>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPageNum(1); }} placeholder="Search documents…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
        </div>
        <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPageNum(1); }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          {["grid", "list"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2.5 ${view === v ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}>
              <Icon name={v} className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Icon name="documents" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-500 font-medium">No documents found</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Documents */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((doc) => <DocCard key={doc.id} doc={doc} />)}
        </div>
      ) : (
        <Card className="p-2 space-y-0.5">
          {paginated.map((doc) => <DocRow key={doc.id} doc={doc} />)}
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPageNum((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
            <Icon name="chevronleft" className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPageNum(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? "bg-blue-600 text-white" : "border border-slate-200 hover:bg-slate-50 text-slate-600"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
            <Icon name="chevronright" className="w-4 h-4" />
          </button>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete document?" message="This will permanently remove this document from MediVault. This action cannot be undone." />
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: DOCUMENT DETAIL
// ─────────────────────────────────────────────

const DocDetailPage = ({ doc, setPage }) => {
  if (!doc) return null;
  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => setPage("documents")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <Icon name="arrowback" className="w-4 h-4" /> Back to Documents
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview panel */}
        <Card className="p-5 flex flex-col items-center justify-center min-h-64 bg-slate-50">
          <div className="w-20 h-24 bg-white rounded-xl shadow-md flex flex-col items-center justify-center border border-slate-200 mb-4">
            <Icon name="file" className="w-10 h-10 text-blue-400" />
            <span className="text-xs text-slate-400 mt-1 uppercase">{doc.type}</span>
          </div>
          <p className="text-sm text-slate-500 text-center">Document preview</p>
          <p className="text-xs text-slate-400 mt-0.5">{doc.size}</p>
          <div className="flex gap-2 mt-4">
            <PrimaryBtn className="py-2 text-xs"><Icon name="download" className="w-3.5 h-3.5" /> Download</PrimaryBtn>
            <SecondaryBtn className="py-2 text-xs"><Icon name="share" className="w-3.5 h-3.5" /> Share</SecondaryBtn>
          </div>
        </Card>

        {/* Info */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Icon name="file" className="w-4 h-4 text-blue-500" /> Document Information
            </h3>
            <dl className="space-y-3">
              {[
                { label: "Title", value: doc.title },
                { label: "Category", value: <Badge label={doc.category} variant={categoryColor(doc.category)} /> },
                { label: "Hospital", value: doc.hospital },
                { label: "Date Issued", value: doc.dateIssued },
                { label: "Upload Date", value: doc.uploadDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">{label}</dt>
                  <dd className="text-sm text-slate-700 flex-1">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Icon name="info" className="w-4 h-4 text-teal-500" /> Extracted Information <span className="text-xs font-normal text-slate-400 ml-1">via OCR</span>
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Important Dates</p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.extractedInfo.dates.map((d) => (
                    <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{d}</span>
                  ))}
                </div>
              </div>
              {doc.extractedInfo.doctors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Doctors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.extractedInfo.doctors.map((dr) => (
                      <span key={dr} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg">{dr}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Patient Status</p>
                <p className="text-sm text-slate-700">{doc.extractedInfo.patientStatus}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Notes</p>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3">{doc.extractedInfo.notes}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: AI VERIFICATION
// ─────────────────────────────────────────────

const VerificationPage = ({ alerts, setAlerts }) => {
  const [filter, setFilter] = useState("all");

  const displayed = alerts.filter((a) =>
    filter === "all" ? true : filter === "unreviewed" ? !a.reviewed : a.reviewed
  );

  const markReviewed = (id) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, reviewed: true } : a));

  const severityVariant = { High: "high", Medium: "medium", Low: "low" };
  const severityBorder = { High: "border-l-red-500", Medium: "border-l-amber-500", Low: "border-l-blue-400" };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">AI Verification Alerts</h2>
        <p className="text-sm text-slate-500 mt-1">Inconsistencies detected across your uploaded documents.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", count: alerts.length, color: "bg-slate-50 text-slate-700" },
          { label: "Unreviewed", count: alerts.filter((a) => !a.reviewed).length, color: "bg-amber-50 text-amber-700" },
          { label: "Reviewed", count: alerts.filter((a) => a.reviewed).length, color: "bg-emerald-50 text-emerald-700" },
        ].map((s) => (
          <Card key={s.label} className={`p-4 border-0 ${s.color}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "unreviewed", "reviewed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-slate-600 font-medium">No inconsistencies found</h3>
          <p className="text-sm text-slate-400 mt-1">Your documents are consistent — great job!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((alert) => (
            <Card key={alert.id} className={`p-5 border-l-4 ${severityBorder[alert.severity]} ${alert.reviewed ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="alert" className={`w-5 h-5 ${alert.severity === "High" ? "text-red-500" : alert.severity === "Medium" ? "text-amber-500" : "text-blue-500"}`} />
                  <h4 className="font-semibold text-slate-800">{alert.title}</h4>
                </div>
                <Badge label={alert.severity} variant={severityVariant[alert.severity]} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{alert.explanation}</p>
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Documents involved</p>
                <div className="flex flex-wrap gap-2">
                  {alert.documents.map((d) => (
                    <span key={d} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Icon name="file" className="w-3 h-3" /> {d}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                {!alert.reviewed && (
                  <PrimaryBtn onClick={() => markReviewed(alert.id)} className="py-2 text-xs">
                    <Icon name="check" className="w-3.5 h-3.5" /> Mark as reviewed
                  </PrimaryBtn>
                )}
                {alert.reviewed && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <Icon name="check" className="w-4 h-4" /> Reviewed
                  </span>
                )}
                <SecondaryBtn className="py-2 text-xs"><Icon name="download" className="w-3.5 h-3.5" /> Download documents</SecondaryBtn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: EMERGENCY PACKAGE WIZARD
// ─────────────────────────────────────────────

const PACKAGE_PURPOSES = [
  { id: "flight", label: "Flight Cancellation", icon: "package" },
  { id: "hotel", label: "Hotel Cancellation", icon: "package" },
  { id: "insurance", label: "Insurance Claim", icon: "shield" },
  { id: "employer", label: "Employer Leave", icon: "documents" },
  { id: "other", label: "Other", icon: "file" },
];

const EmergencyPage = () => {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const toggleDoc = (id) => setSelectedDocs((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const reset = () => { setStep(1); setPurpose(""); setSelectedDocs([]); setGenerated(false); };

  const steps = ["Purpose", "Select Docs", "Review", "Generate"];

  if (generated) return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
        <Icon name="package" className="w-10 h-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Package Ready!</h2>
      <p className="text-slate-500 mt-2 text-sm">
        Your emergency package containing {selectedDocs.length} document{selectedDocs.length !== 1 ? "s" : ""} has been compiled and is ready to download.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-7 w-full">
        <PrimaryBtn className="flex-1 justify-center"><Icon name="download" className="w-4 h-4" /> Download Package</PrimaryBtn>
        <SecondaryBtn className="flex-1 justify-center"><Icon name="share" className="w-4 h-4" /> Share Package</SecondaryBtn>
      </div>
      <button onClick={reset} className="mt-4 text-sm text-slate-400 hover:text-slate-600">Create another package</button>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Emergency Package Generator</h2>
        <p className="text-sm text-slate-500 mt-1">Compile a document package for specific purposes in a few steps.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 transition-colors ${
              i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
            }`}>
              {i + 1 < step ? <Icon name="check" className="w-4 h-4" /> : i + 1}
            </div>
            <div className={`hidden sm:block text-xs font-medium ml-2 ${i + 1 === step ? "text-blue-600" : "text-slate-400"}`}>{s}</div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i + 1 < step ? "bg-emerald-400" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">What is this package for?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PACKAGE_PURPOSES.map((p) => (
              <button key={p.id} onClick={() => setPurpose(p.id)}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  purpose === p.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                }`}>
                <Icon name={p.icon} className={`w-5 h-5 mb-2 ${purpose === p.id ? "text-blue-600" : "text-slate-400"}`} />
                <p className={`text-sm font-medium ${purpose === p.id ? "text-blue-700" : "text-slate-700"}`}>{p.label}</p>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <PrimaryBtn onClick={() => setStep(2)} disabled={!purpose}>Next: Select Documents</PrimaryBtn>
          </div>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-1">Select documents to include</h3>
          <p className="text-sm text-slate-400 mb-4">{selectedDocs.length} document{selectedDocs.length !== 1 ? "s" : ""} selected</p>
          <div className="space-y-2">
            {MOCK_DOCUMENTS.map((doc) => (
              <div key={doc.id} onClick={() => toggleDoc(doc.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-colors ${
                  selectedDocs.includes(doc.id) ? "border-blue-400 bg-blue-50" : "border-transparent hover:bg-slate-50"
                }`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${
                  selectedDocs.includes(doc.id) ? "bg-blue-600 border-blue-600" : "border-slate-300"
                }`}>
                  {selectedDocs.includes(doc.id) && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-400">{doc.hospital}</p>
                </div>
                <Badge label={doc.category} variant={categoryColor(doc.category)} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <SecondaryBtn onClick={() => setStep(1)}>Back</SecondaryBtn>
            <PrimaryBtn onClick={() => setStep(3)} disabled={!selectedDocs.length}>Review Package</PrimaryBtn>
          </div>
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-1">Review package contents</h3>
          <p className="text-sm text-slate-400 mb-4">
            Purpose: <span className="font-medium text-slate-600">{PACKAGE_PURPOSES.find((p) => p.id === purpose)?.label}</span>
          </p>
          <div className="space-y-2 mb-5">
            {selectedDocs.map((id) => {
              const doc = MOCK_DOCUMENTS.find((d) => d.id === id);
              return doc ? (
                <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Icon name="file" className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-400">{doc.hospital}</p>
                  </div>
                  <Badge label={doc.category} variant={categoryColor(doc.category)} />
                </div>
              ) : null;
            })}
          </div>
          <div className="flex gap-3">
            <SecondaryBtn onClick={() => setStep(2)}>Back</SecondaryBtn>
            <PrimaryBtn onClick={() => setStep(4)}>Confirm & Generate</PrimaryBtn>
          </div>
        </Card>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <Card className="p-6 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="package" className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-2">Ready to generate your package</h3>
          <p className="text-sm text-slate-500 mb-6">
            {selectedDocs.length} document{selectedDocs.length !== 1 ? "s" : ""} will be compiled into a single downloadable package for <strong>{PACKAGE_PURPOSES.find((p) => p.id === purpose)?.label}</strong>.
          </p>
          {generating ? (
            <div className="flex flex-col items-center gap-3">
              <span className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Compiling your package…</span>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <SecondaryBtn onClick={() => setStep(3)}>Back</SecondaryBtn>
              <PrimaryBtn onClick={generate}><Icon name="package" className="w-4 h-4" /> Generate Package</PrimaryBtn>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: NOTIFICATIONS
// ─────────────────────────────────────────────

const NotificationsPage = ({ notifications, setNotifications }) => {
  const markRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const clearAll = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const iconMap = { upload: "upload", alert: "alert", package: "package", check: "check" };
  const iconColor = { upload: "text-blue-500 bg-blue-50", alert: "text-amber-500 bg-amber-50", package: "text-teal-500 bg-teal-50", check: "text-emerald-500 bg-emerald-50" };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
          {unread > 0 && <p className="text-sm text-slate-500 mt-0.5">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={clearAll} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="bell" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-500 font-medium">No notifications</h3>
          <p className="text-sm text-slate-400 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <Card className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor[n.icon] || "text-slate-400 bg-slate-100"}`}>
                <Icon name={iconMap[n.icon] || "bell"} className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>{n.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                  Mark read
                </button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: PROFILE
// ─────────────────────────────────────────────

const ProfilePage = ({ onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ name: MOCK_USER.name, email: MOCK_USER.email, phone: MOCK_USER.phone });
  const [saved, setSaved] = useState(false);

  const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-xl font-bold text-slate-800">Profile</h2>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl">
          <Icon name="check" className="w-4 h-4" /> Profile updated successfully.
        </div>
      )}

      {/* Avatar + name */}
      <Card className="p-6">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white text-xl font-bold">
            {MOCK_USER.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{form.name}</h3>
            <p className="text-slate-500 text-sm">{form.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "name", label: "Full name", type: "text" },
            { key: "email", label: "Email address", type: "email" },
            { key: "phone", label: "Phone number", type: "tel" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
              <input type={type} value={form[key]} disabled={!editing}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  editing ? "border-slate-300 bg-white" : "border-slate-100 bg-slate-50 text-slate-600"
                }`} />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            {!editing ? (
              <PrimaryBtn onClick={() => setEditing(true)}><Icon name="edit" className="w-4 h-4" /> Edit Profile</PrimaryBtn>
            ) : (
              <>
                <PrimaryBtn onClick={save}><Icon name="check" className="w-4 h-4" /> Save Changes</PrimaryBtn>
                <SecondaryBtn onClick={() => setEditing(false)}>Cancel</SecondaryBtn>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Account actions */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Account</h3>
        <div className="space-y-2">
          <button onClick={() => setChangingPw(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium">
            <Icon name="lock" className="w-5 h-5 text-slate-400" /> Change password
            <Icon name="chevronright" className="w-4 h-4 text-slate-300 ml-auto" />
          </button>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-sm font-medium">
            <Icon name="logout" className="w-5 h-5" /> Sign out
          </button>
        </div>
      </Card>

      {/* Change password modal */}
      <Modal open={changingPw} onClose={() => setChangingPw(false)} title="Change Password">
        <div className="space-y-4">
          {["Current password", "New password", "Confirm new password"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50" />
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <PrimaryBtn onClick={() => setChangingPw(false)}>Update Password</PrimaryBtn>
            <SecondaryBtn onClick={() => setChangingPw(false)}>Cancel</SecondaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// ROOT APP COMPONENT
// ─────────────────────────────────────────────

export default function App() {
  // Auth state
  const [authed, setAuthed] = useState(false);
  const [authPage, setAuthPage] = useState("login"); // "login" | "register"

  // App state
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Content area left offset for sidebar
  const mainClass = `flex-1 min-h-screen transition-all duration-300 ${
    sidebarCollapsed ? "md:ml-16" : "md:ml-60"
  }`;

  if (!authed) {
    if (authPage === "register") return <RegisterPage onLogin={() => setAuthed(true)} setPage={setAuthPage} />;
    return <LoginPage onLogin={() => setAuthed(true)} setPage={setAuthPage} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage setPage={setPage} documents={documents} alerts={alerts} notifications={notifications} />;
      case "upload": return <UploadPage onUpload={() => {}} />;
      case "documents": return <DocumentsPage documents={documents} setDocuments={setDocuments} setSelectedDoc={setSelectedDoc} setPage={setPage} />;
      case "docdetail": return <DocDetailPage doc={selectedDoc} setPage={setPage} />;
      case "verification": return <VerificationPage alerts={alerts} setAlerts={setAlerts} />;
      case "emergency": return <EmergencyPage />;
      case "notifications": return <NotificationsPage notifications={notifications} setNotifications={setNotifications} />;
      case "profile": return <ProfilePage onLogout={() => setAuthed(false)} />;
      default: return <DashboardPage setPage={setPage} documents={documents} alerts={alerts} notifications={notifications} />;
    }
  };

  const pageTitle = NAV_ITEMS.find((n) => n.id === page)?.label || "MediVault";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar currentPage={page} setPage={setPage} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} unreadCount={unreadCount} />

      {/* Main content */}
      <div className={mainClass}>
        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0">
            <Icon name="documents" className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold text-slate-800 flex-1 truncate">{pageTitle}</h1>
          {unreadCount > 0 && (
            <button onClick={() => setPage("notifications")} className="relative p-1.5 text-slate-400">
              <Icon name="bell" className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">{unreadCount}</span>
            </button>
          )}
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-3.5 items-center gap-4">
          <h1 className="font-semibold text-slate-800">{pageTitle}</h1>
          <div className="flex-1" />
          <button onClick={() => setPage("notifications")} className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <Icon name="bell" className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 cursor-pointer" onClick={() => setPage("profile")}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
              {MOCK_USER.avatar}
            </div>
            <span className="text-sm font-medium text-slate-700">{MOCK_USER.name.split(" ")[0]}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 pb-24 md:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav currentPage={page} setPage={setPage} unreadCount={unreadCount} />
    </div>
  );
}
