import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/mockData';
import { Building2, MapPin, CheckCircle, Download, Calendar, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface ProjectsScreenProps {
  onContactProject: (projectName: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onContactProject }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadBrochure = (projectName: string) => {
    setDownloadSuccess(projectName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
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
        </div>

        {/* Projects List */}
        <div className="space-y-12">
          {PROJECTS_DATA.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
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

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-gray-500 block">Possession</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded inline-block">
                        {project.possessionDate}
                      </span>
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
    </div>
  );
};
