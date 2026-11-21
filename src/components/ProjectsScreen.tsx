import React, { useState } from 'react';
import { Project, UserProfile } from '../types';
import { LeadSubmission } from '../utils/security';
import { saveFirestoreLead } from '../services/firebaseService';
import { downloadLuxuryDossier } from '../utils/dossierGenerator';
import {
  Building2,
  MapPin,
  CheckCircle,
  Download,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Edit3,
  Trash2,
  X,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Phone
} from 'lucide-react';

interface ProjectsScreenProps {
  projects: Project[];
  isAdminUser: boolean;
  onContactProject: (projectName: string) => void;
  onAddProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onRestoreDefaults?: () => void;
  user?: UserProfile | null;
  onLeadSubmitted?: (lead: LeadSubmission) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  isAdminUser,
  onContactProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onRestoreDefaults,
  user,
  onLeadSubmitted
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Brochure Gating Modal State
  const [brochureModalProject, setBrochureModalProject] = useState<Project | null>(null);
  const [brochureName, setBrochureName] = useState(user?.name || '');
  const [brochurePhone, setBrochurePhone] = useState(user?.phone ? user.phone.replace(/[^0-9]/g, '').slice(-10) : '');
  const [brochureEmail, setBrochureEmail] = useState(user?.email || '');
  const [brochureTimeline, setBrochureTimeline] = useState('Immediate Purchase (< 30 Days)');
  const [isBrochureSubmitting, setIsBrochureSubmitting] = useState(false);
  const [brochureError, setBrochureError] = useState('');
  const [brochureDownloadedSuccess, setBrochureDownloadedSuccess] = useState(false);
  const [brochureWaUrl, setBrochureWaUrl] = useState('');

  // Form state for create/edit project modal
  const [formName, setFormName] = useState('');
  const [formDeveloper, setFormDeveloper] = useState('');
  const [formLocality, setFormLocality] = useState('');
  const [formPriceStarting, setFormPriceStarting] = useState('');
  const [formUnits, setFormUnits] = useState('');
  const [formStatus, setFormStatus] = useState<'Ready to Move' | 'Under Construction' | 'Newly Launched'>('Under Construction');
  const [formPossession, setFormPossession] = useState('');
  const [formReraNumber, setFormReraNumber] = useState('UPRERAAGT2024/9999');
  const [formCoverImage, setFormCoverImage] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80');
  const [formDescription, setFormDescription] = useState('');
  const [formTotalArea, setFormTotalArea] = useState('');

  const handleOpenBrochureModal = (project: Project) => {
    setBrochureModalProject(project);
    setBrochureError('');
    setBrochureDownloadedSuccess(false);
    if (user?.name) setBrochureName(user.name);
    if (user?.phone) setBrochurePhone(user.phone.replace(/[^0-9]/g, '').slice(-10));
    if (user?.email) setBrochureEmail(user.email);
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brochureModalProject) return;
    setBrochureError('');

    const cleanPhone = brochurePhone.replace(/[^0-9]/g, '');

    if (!brochureName.trim() || brochureName.trim().length < 2) {
      setBrochureError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (brochureName.toLowerCase().includes('prospective buyer')) {
      setBrochureError('Please enter your genuine legal name for dossier authorization.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setBrochureError('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }
    if (cleanPhone.endsWith('9149079913') || cleanPhone.endsWith('9557138449')) {
      setBrochureError('Please enter your own personal mobile number to receive your project dossier.');
      return;
    }

    try {
      setIsBrochureSubmitting(true);
      const leadId = `LEAD-${Date.now()}`;
      const cleanEmail = brochureEmail.trim().toLowerCase();

      const brochureLead: LeadSubmission = {
        id: leadId,
        propertyId: `project-${brochureModalProject.id}`,
        propertyTitle: `Project Brochure: ${brochureModalProject.name}`,
        buyerName: brochureName.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        preferredTime: `Dossier Download | Timeline: ${brochureTimeline} | Project: ${brochureModalProject.name} | Locality: ${brochureModalProject.locality}`,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
        status: 'new',
        inquiryType: 'Project Brochure Download',
        projectTitle: brochureModalProject.name,
        timeline: brochureTimeline
      };

      // 1. Deliver Styled Luxury Digital Dossier (.html executive printable dossier) immediately
      downloadLuxuryDossier(brochureModalProject, brochureName.trim(), cleanPhone);

      // 2. Prepare & launch WhatsApp concierge desk at +91 9149079913 in the same user click tick
      const waText = encodeURIComponent(
        `🏰 *Royal Agra Estate — Project Dossier Request*\n\n` +
        `👤 *Client:* ${brochureLead.buyerName}\n` +
        `📱 *Mobile:* ${brochureLead.phone}\n` +
        (brochureLead.email ? `📧 *Email:* ${brochureLead.email}\n` : '') +
        `🏢 *Project:* ${brochureModalProject.name}\n` +
        `📍 *Location:* ${brochureModalProject.locality}\n` +
        `💰 *Starting Price:* ${brochureModalProject.priceStarting}\n` +
        `⏱️ *Timeline:* ${brochureTimeline}\n\n` +
        `Hello Royal Agra Estate, I have downloaded the Luxury Dossier for ${brochureModalProject.name} and would like to arrange a private site inspection.`
      );
      const waUrl = `https://wa.me/919149079913?text=${waText}`;
      setBrochureWaUrl(waUrl);

      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        console.warn('Failed to open WhatsApp window:', err);
      }

      // 3. Save lead directly to Hostinger persistence API (/api/leads.php) without duplicate requests
      if (onLeadSubmitted) {
        onLeadSubmitted(brochureLead);
      } else {
        await saveFirestoreLead(brochureLead);
      }

      setDownloadSuccess(brochureModalProject.name);
      setTimeout(() => setDownloadSuccess(null), 5000);
      setBrochureDownloadedSuccess(true);
    } catch (err) {
      console.error('Failed to process dossier request:', err);
      setBrochureError('Failed to process dossier download. Please check your connection or contact concierge.');
    } finally {
      setIsBrochureSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormDeveloper('Royal Agra Developers');
    setFormLocality('Fatehabad Road, Agra');
    setFormPriceStarting('₹2.10 Cr onwards');
    setFormUnits('32 Luxury Units');
    setFormStatus('Under Construction');
    setFormPossession('December 2026');
    setFormReraNumber('UPRERAAGT2024/9999');
    setFormCoverImage('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80');
    setFormDescription('A landmark gated development offering modern architecture and world-class amenities.');
    setFormTotalArea('3.5 Acres Estate');
    setIsCreating(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setFormName(proj.name);
    setFormDeveloper(proj.developer);
    setFormLocality(proj.locality);
    setFormPriceStarting(proj.priceStarting);
    setFormUnits(proj.units);
    setFormStatus(proj.status);
    setFormPossession(proj.possessionDate);
    setFormReraNumber(proj.reraNumber || 'UPRERAAGT2024/9999');
    setFormCoverImage(proj.coverImage);
    setFormDescription(proj.description);
    setFormTotalArea(proj.totalArea);
    setEditingProject(proj);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const projObj: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      name: formName.trim() || 'New Luxury Project',
      developer: formDeveloper.trim() || 'Royal Agra Developers',
      locality: formLocality.trim() || 'Fatehabad Road, Agra',
      priceStarting: formPriceStarting.trim() || '₹2.00 Cr onwards',
      units: formUnits.trim() || '50 Units',
      status: formStatus,
      possessionDate: formPossession.trim() || 'December 2026',
      reraNumber: formReraNumber.trim() || 'UPRERAAGT2024/9999',
      coverImage: formCoverImage,
      images: [formCoverImage],
      description: formDescription.trim() || 'Luxury residential development in Agra.',
      highlights: ['Rooftop Sky Deck', '24/7 Gated Security', 'Clubhouse & Pool'],
      totalArea: formTotalArea.trim() || '4.0 Acres',
      unitConfigurations: ['3 BHK (2,100 sq.ft)', '4 BHK (2,900 sq.ft)']
    };

    if (editingProject) {
      onEditProject(projObj);
      setEditingProject(null);
    } else {
      onAddProject(projObj);
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F382C]/10 text-[#0F382C] text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#0F382C]" />
            <span>Mega Gated Townships & Developments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F382C]">
            New Luxury Projects in Agra
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Direct developer collaborations with verified clear-title deeds, zero brokerage fees on new bookings, and flexible installment plans with premier banks.
          </p>

          {/* Add New Project Button for Admin */}
          {isAdminUser && (
            <div className="mt-6">
              <button
                type="button"
                id="add-new-project-btn"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 bg-[#0F382C] hover:bg-[#164E3D] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#E4D5B7]" />
                <span>Add New Project (Admin)</span>
              </button>
            </div>
          )}
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-10 sm:p-14 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0F382C] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <Building2 className="w-8 h-8 text-[#0F382C]" />
            </div>
            <h3 className="text-xl font-serif-luxury font-bold text-[#0F382C] mb-2">
              No Active Projects Listed
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              All previous projects have been removed or archived. New luxury developments will appear here once listed.
            </p>
            {isAdminUser && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F382C] hover:bg-[#164E3D] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-[#E4D5B7]" />
                  <span>Add New Luxury Project</span>
                </button>
                {onRestoreDefaults && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Restore sample luxury projects into the catalogue?")) {
                        onRestoreDefaults();
                      }
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Restore Sample Projects</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 relative"
            >
              {/* Media Col (5 cols) */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto bg-gray-900 overflow-hidden">
                <img
                  src={project.coverImage || (project as any).image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-md ${
                    project.status === 'Ready to Move'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0F382C] text-[#E4D5B7]'
                  }`}>
                    {project.status}
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white/90 text-[#0F382C] text-xs font-bold flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Project
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#E4D5B7] font-semibold block">
                    {project.totalArea}
                  </span>
                  <span className="text-2xl font-serif-luxury font-bold text-white">
                    {project.priceStarting}
                  </span>
                </div>
              </div>

              {/* Content Col (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  
                  {/* Top line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">
                        Developer: <strong className="text-[#0F382C]">{project.developer}</strong>
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F382C] mt-0.5">
                        {project.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-gray-500 block">Possession</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded inline-block">
                          {project.possessionDate}
                        </span>
                      </div>

                      {/* Admin Edit/Delete buttons */}
                      {isAdminUser && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-[#0F382C] rounded-lg"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete project "${project.name}"?`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location & Title Status & UP RERA Badge */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 my-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F382C]" />
                      <span>{project.locality}</span>
                    </div>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>UP RERA: {project.reraNumber || 'UPRERAAGT2024/9999'}</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">Freehold Clear Title</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Unit Configurations */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      Available Unit Typologies:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(project.unitConfigurations || (project as any).typologies || ['Luxury Residences', 'Bespoke Typologies']).map((config, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium rounded-md"
                        >
                          {config}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {(project.highlights || (project as any).features || ['Prime Agra Location', 'Clear Legal Verification', 'Modern Architectural Design']).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    id={`brochure-btn-${project.id}`}
                    onClick={() => handleOpenBrochureModal(project)}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#0F382C] border border-[#0F382C]/30 hover:bg-[#0F382C]/5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadSuccess === project.name ? '✓ Dossier Downloaded' : 'Download E-Brochure (Dossier)'}</span>
                  </button>

                  <button
                    type="button"
                    id={`inquire-proj-btn-${project.id}`}
                    onClick={() => onContactProject(project.name)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Pricing & Site Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
          </div>
        )}

      </div>

      {/* Gated Luxury Brochure Verification Modal */}
      {brochureModalProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative max-h-[92vh] overflow-y-auto border border-gray-100">
            
            {/* Header */}
            <div className="bg-[#0F382C] text-white p-5 flex items-center justify-between border-b border-[#164E3D] sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#E4D5B7]" />
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-white">
                    Unlock Executive Project Dossier
                  </h3>
                  <p className="text-[11px] text-[#E4D5B7]/90">
                    {brochureModalProject.name} • Official Architectural Guide
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBrochureModalProject(null)}
                className="p-1 text-white/80 hover:text-white rounded-full hover:bg-[#164E3D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {brochureDownloadedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury font-bold text-lg text-[#0F382C]">
                      Luxury Dossier Downloaded!
                    </h4>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      Thank you, <strong className="text-gray-900">{brochureName}</strong>. The executive digital dossier for <strong className="text-[#0F382C]">{brochureModalProject.name}</strong> has been saved to your downloads. Our advisory desk has also opened WhatsApp to assist with private site inspections.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {brochureWaUrl && (
                      <a
                        href={brochureWaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebd54] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Connect on WhatsApp</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setBrochureModalProject(null)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white text-xs font-bold rounded-lg shadow-sm"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Project Quick Overview Banner */}
                  <div className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-gray-200">
                    <img
                      src={brochureModalProject.coverImage || (brochureModalProject as any).image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                      alt={brochureModalProject.name}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'; }}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-300 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[#0F382C] text-sm block truncate">
                        {brochureModalProject.name}
                      </span>
                      <span className="text-xs text-gray-600 block">
                        📍 {brochureModalProject.locality}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                        <span className="font-bold text-emerald-800">{brochureModalProject.priceStarting}</span>
                        <span>•</span>
                        <span className="text-gray-500 font-mono">RERA: {brochureModalProject.reraNumber || 'Verified'}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Enter your contact details to instantly download the complete executive digital dossier (printable HTML with verified architectural specifications, ADA sanctions, and price guides).
                  </p>

                  <form onSubmit={handleBrochureSubmit} className="space-y-4">
                    {brochureError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{brochureError}</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="brochure-applicant-name" className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="brochure-applicant-name"
                        type="text"
                        required
                        value={brochureName}
                        onChange={(e) => setBrochureName(e.target.value)}
                        placeholder="e.g. Vikramaditya Sharma"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label htmlFor="brochure-applicant-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                        WhatsApp / Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-gray-400 font-mono">+91</span>
                        <input
                          id="brochure-applicant-phone"
                          type="tel"
                          required
                          maxLength={10}
                          value={brochurePhone.replace(/[^0-9]/g, '').slice(-10)}
                          onChange={(e) => setBrochurePhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="brochure-applicant-email" className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="brochure-applicant-email"
                        type="email"
                        value={brochureEmail}
                        onChange={(e) => setBrochureEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C]"
                      />
                    </div>

                    <div>
                      <label htmlFor="brochure-timeline-select" className="block text-xs font-semibold text-gray-700 mb-1">
                        Estimated Purchase Timeline
                      </label>
                      <select
                        id="brochure-timeline-select"
                        value={brochureTimeline}
                        onChange={(e) => setBrochureTimeline(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F382C] bg-white"
                      >
                        <option value="Immediate Purchase (< 30 Days)">Immediate Purchase (&lt; 30 Days)</option>
                        <option value="1 – 3 Months">1 – 3 Months</option>
                        <option value="3 – 6 Months">3 – 6 Months</option>
                        <option value="Investment / Wealth Preservation">Investment / Wealth Preservation</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isBrochureSubmitting}
                        id="submit-brochure-verification-btn"
                        className="w-full py-3 px-4 bg-[#0F382C] hover:bg-[#164E3D] text-[#E4D5B7] font-serif-luxury font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-[#C5A880]/30 disabled:opacity-50 cursor-pointer"
                      >
                        {isBrochureSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#E4D5B7]" />
                            <span>Generating Luxury Digital Dossier...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-[#E4D5B7]" />
                            <span>Download Luxury Digital Dossier (.HTML)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1 text-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>100% Confidential • Official ADA & UP RERA Documentation</span>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingProject(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif-luxury font-bold text-[#0F382C] mb-4">
              {editingProject ? 'Edit Luxury Project' : 'Add New Luxury Project'}
            </h3>

            <form onSubmit={handleSaveProject} autoComplete="off" className="space-y-4 text-xs">
              <div>
                <label htmlFor="project-form-name" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Project Name</label>
                <input
                  id="project-form-name"
                  name="projectName"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="project-form-developer" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Developer Name</label>
                <input
                  id="project-form-developer"
                  name="developer"
                  type="text"
                  required
                  value={formDeveloper}
                  onChange={(e) => setFormDeveloper(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="project-form-locality" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Locality / Location</label>
                <input
                  id="project-form-locality"
                  name="locality"
                  type="text"
                  required
                  value={formLocality}
                  onChange={(e) => setFormLocality(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="project-form-price" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Price Starting</label>
                  <input
                    id="project-form-price"
                    name="priceStarting"
                    type="text"
                    required
                    value={formPriceStarting}
                    onChange={(e) => setFormPriceStarting(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="project-form-status" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Status</label>
                  <select
                    id="project-form-status"
                    name="status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  >
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Newly Launched">Newly Launched</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="project-form-rera" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">UP RERA Reg. ID</label>
                  <input
                    id="project-form-rera"
                    name="reraNumber"
                    type="text"
                    required
                    value={formReraNumber}
                    onChange={(e) => setFormReraNumber(e.target.value)}
                    placeholder="UPRERAAGT2024/9999"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="project-form-possession" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Possession Date</label>
                  <input
                    id="project-form-possession"
                    name="possession"
                    type="text"
                    required
                    value={formPossession}
                    onChange={(e) => setFormPossession(e.target.value)}
                    placeholder="e.g. December 2026"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="project-form-cover-image" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Cover Image URL</label>
                <input
                  id="project-form-cover-image"
                  name="coverImage"
                  type="url"
                  required
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="project-form-description" className="block font-bold text-gray-700 uppercase mb-1 cursor-pointer">Description</label>
                <textarea
                  id="project-form-description"
                  name="description"
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingProject(null); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0F382C] text-white font-bold rounded-lg shadow-md cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
