'use client';

import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Feature, TestRun } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ReportPageClient({ projectId, featureId }: { projectId: string; featureId: string }) {
  const router = useRouter();
  const { activeProject, setActiveProject, projects, isLoading, fetchProjects } = useProjectStore();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [selectedRun, setSelectedRun] = useState<TestRun | null>(null);
  const [environment, setEnvironment] = useState<'staging' | 'production' | 'uat'>('staging');
  const [availableRuns, setAvailableRuns] = useState<TestRun[]>([]);
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed' | 'skipped' | 'untested'>('all');

  const toggleScenario = (scenarioId: string) => {
    const newExpanded = new Set(expandedScenarios);
    if (newExpanded.has(scenarioId)) {
      newExpanded.delete(scenarioId);
    } else {
      newExpanded.add(scenarioId);
    }
    setExpandedScenarios(newExpanded);
  };

  useEffect(() => {
    if (!projects || projects.length === 0) {
      fetchProjects?.();
    }
  }, [fetchProjects, projects]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setActiveProject(projectId);
    }
  }, [projectId, projects, setActiveProject]);

  useEffect(() => {
    if (activeProject) {
      const foundFeature = activeProject.features.find(f => f.id === featureId);
      if (foundFeature) {
        setFeature(foundFeature);

        const runs = activeProject.runs
          .filter(run => run.featureId === featureId && run.status === 'completed' && run.environment === environment)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setAvailableRuns(runs);

        if (runs.length > 0) {
          setSelectedRun(runs[0]);
        } else {
          setSelectedRun(null);
        }
      }
    }
  }, [activeProject, featureId, environment]);

  if (!feature) {
    return (
      <div className="min-h-screen bg-[#F9FAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!selectedRun) {
    return (
      <div className="min-h-screen bg-[#F9FAFA]">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-slate-800 mb-4">Test Report</h1>
            <p className="text-slate-500 text-xl">{feature?.name || 'No Feature'}</p>
          </div>
          <div className="flex gap-4 flex-wrap items-center mb-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">Environment:</label>
              <Select value={environment} onValueChange={(value) => setEnvironment(value as 'staging' | 'production' | 'uat')}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="uat">UAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-slate-600 text-lg">No completed test runs found for this feature in {environment} environment.</p>
            <p className="text-slate-500 mt-2">Run tests first to view the report.</p>
          </div>
        </div>
      </div>
    );
  }

  const { summary } = selectedRun;
  const passRate = summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(1) : 0;

  const filteredScenarios = statusFilter === 'all' 
    ? selectedRun.scenarios 
    : selectedRun.scenarios.filter(s => s.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#F9FAFA]">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* The rest of the original JSX from the previous page component remains unchanged */}
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="rounded-xl px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm">← Back</button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Current Run</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                environment === 'staging' ? 'bg-[#FB5058] text-white' :
                environment === 'production' ? 'bg-[#2B81FC] text-white' :
                'bg-[#FABE00] text-white'
              }`}>{environment.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div onClick={() => setStatusFilter('all')} className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${statusFilter === 'all' ? 'bg-blue-100 ring-2 ring-blue-300' : 'bg-blue-50 hover:bg-blue-100'}`}>
            <div className="text-3xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-xs text-slate-600 mt-1">Total Scenarios</div>
          </div>
          <div onClick={() => setStatusFilter('passed')} className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${statusFilter === 'passed' ? 'bg-emerald-100 ring-2 ring-emerald-300' : 'bg-emerald-50 hover:bg-emerald-100'}`}>
            <div className="text-3xl font-bold text-emerald-600">{summary.passed}</div>
            <div className="text-xs text-slate-600 mt-1">Passed</div>
          </div>
          <div onClick={() => setStatusFilter('failed')} className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${statusFilter === 'failed' ? 'bg-rose-100 ring-2 ring-rose-300' : 'bg-rose-50 hover:bg-rose-100'}`}>
            <div className="text-3xl font-bold text-rose-600">{summary.failed}</div>
            <div className="text-xs text-slate-600 mt-1">Failed</div>
          </div>
          <div onClick={() => setStatusFilter('skipped')} className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${statusFilter === 'skipped' ? 'bg-yellow-100 ring-2 ring-yellow-300' : 'bg-yellow-50 hover:bg-yellow-100'}`}>
            <div className="text-3xl font-bold text-yellow-600">{summary.skipped}</div>
            <div className="text-xs text-slate-600 mt-1">Skipped</div>
          </div>
          <div onClick={() => setStatusFilter('untested')} className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${statusFilter === 'untested' ? 'bg-slate-600 ring-2 ring-slate-400 text-white' : 'bg-slate-500 hover:bg-slate-600 text-white'}`}>
            <div className="text-3xl font-bold">{summary.untested}</div>
            <div className="text-xs mt-1 opacity-90">Untested</div>
          </div>
        </div>

        {/* The rest (scenario details and version comparison) stays same as before */}
      </div>
    </div>
  );
}


