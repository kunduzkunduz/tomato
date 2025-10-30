'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Feature, Scenario, Step } from '@/lib/types';

export function DocsViewer({ featureId }: { projectId: string; featureId: string }) {
  const { activeProject, projects, fetchProjects } = useProjectStore();
  const [feature, setFeature] = useState<Feature | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!projects || projects.length === 0) {
      fetchProjects?.();
    }
  }, [projects, fetchProjects]);

  useEffect(() => {
    if (activeProject) {
      const foundFeature = activeProject.features.find(f => f.id === featureId);
      if (foundFeature) {
        setFeature(foundFeature);
      }
    }
  }, [activeProject, featureId]);

  if (!feature) {
    return (
      <div className="min-h-screen bg-[#F9FAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFA]">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header aligned with TestRunner style */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="rounded-xl px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm">← Back</button>
            <span></span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white border-2 border-[#FB5058]">
              <span className="text-3xl">🍅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{feature.name}</h1>
              <p className="text-slate-500 text-lg">{feature.description}</p>
            </div>
          </div>
        </div>

        {/* Scenarios Documentation */}
        <div className="space-y-8">
          {feature.scenarios.map((scenario) => (
            <div key={scenario.id} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{scenario.name}</h2>
              <div className="space-y-3">
                {scenario.steps.map((step) => {
                  const keyword = step.keyword.toLowerCase();
                  const getBackgroundColor = () => {
                    if (keyword === 'given') return 'bg-[#2B81FC]';
                    if (keyword === 'when') return 'bg-[#FB5058]';
                    if (keyword === 'then') return 'bg-[#9C006D]';
                    return 'bg-[#00A396]';
                  };
                  
                  return (
                    <div key={step.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getBackgroundColor()} text-white`}>
                          {step.keyword.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-base flex-1 mt-0.5 whitespace-nowrap truncate max-w-full">{step.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
