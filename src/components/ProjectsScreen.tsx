import React, { useState } from 'react';
import { Project } from '../types';
import { Building2, MapPin, CheckCircle, Download, Calendar, ShieldCheck, Sparkles, ArrowRight, PlusCircle, Edit3, Trash2, X } from 'lucide-react';

interface ProjectsScreenProps {
  projects: Project[];
  isAdminUser: boolean;
  onContactProject: (projectName: string) => void;
  onAddProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  isAdminUser,
  onContactProject,
  onAddProject,
  onEditProject,
  onDeleteProject
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for create/edit project modal
  const [formName, setFormName] = useState('');
  const [formDeveloper, setFormDeveloper] = useState('');
  const [formLocality, setFormLocality] = useState('');
  const [formPriceStarting, setFormPriceStarting] = useState('');
  const [formUnits, setFormUnits] = useState('');
  const [formStatus, setFormStatus] = useState<'Ready to Move' | 'Under Construction' | 'Newly Launched'>('Under Construction');
  const [formPossession, setFormPossession] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80');
  const [formDescription, setFormDescription] = useState('');
  const [formTotalArea, setFormTotalArea] = useState('');

  const handleDownloadBrochure = (projectName: string) => {
    setDownloadSuccess(projectName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormDeveloper('Royal Agra Developers');
    setFormLocality('Fatehabad Road, Agra');
    setFormPriceStarting('₹2.10 Cr onwards');
    setFormUnits('32 Luxury Units');
    setFormStatus('Under Construction');
    setFormPossession('December 2026');
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
      reraNumber: 'UPRERAAGT2024/9999',
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
                className="inline-flex items-center gap-2 bg-[#0F382C] hover:bg-[#164E3D] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4 text-[#E4D5B7]" />
                <span>Add New Project (Admin)</span>
              </button>
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="space-y-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 relative"
            >
              {/* Media Col (5 cols) */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto bg-gray-900 overflow-hidden">
                <img
                  src={project.coverImage}
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

                  {/* Location & Title Status */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 my-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F382C]" />
                      <span>{project.locality}</span>
                    </div>
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
                      {project.unitConfigurations.map((config, idx) => (
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
                    {project.highlights.map((h, idx) => (
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
                    onClick={() => handleDownloadBrochure(project.name)}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#0F382C] border border-[#0F382C]/30 hover:bg-[#0F382C]/5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadSuccess === project.name ? '✓ PDF Brochure Downloaded' : 'Download E-Brochure (PDF)'}</span>
                  </button>

                  <button
                    type="button"
                    id={`inquire-proj-btn-${project.id}`}
                    onClick={() => onContactProject(project.name)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#0F382C] hover:bg-[#164E3D] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Pricing & Site Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Create / Edit Project Modal */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingProject(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif-luxury font-bold text-[#0F382C] mb-4">
              {editingProject ? 'Edit Luxury Project' : 'Add New Luxury Project'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Developer Name</label>
                <input
                  type="text"
                  required
                  value={formDeveloper}
                  onChange={(e) => setFormDeveloper(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Locality / Location</label>
                <input
                  type="text"
                  required
                  value={formLocality}
                  onChange={(e) => setFormLocality(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Price Starting</label>
                  <input
                    type="text"
                    required
                    value={formPriceStarting}
                    onChange={(e) => setFormPriceStarting(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select
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

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
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
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0F382C] text-white font-bold rounded-lg shadow-md"
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
