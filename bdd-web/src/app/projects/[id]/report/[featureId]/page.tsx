import ReportPageClient from './report-page-client';

export default async function ReportPage({ params }: { params: Promise<{ id: string; featureId: string }> }) {
  const { id, featureId } = await params;
  return <ReportPageClient projectId={id} featureId={featureId} />;
}

export async function generateStaticParams() {
  return [] as Array<{ id: string; featureId: string }>;
}

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
      setActiveProject(id);
    }
  }, [id, projects, setActiveProject]);

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

  // Filter scenarios based on status
  const filteredScenarios = statusFilter === 'all' 
    ? selectedRun.scenarios 
    : selectedRun.scenarios.filter(s => s.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#F9FAFA]">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header - aligned like TestRunner */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          {/* Top bar */}
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
          {/* Title row */}
          <div className="mt-4 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white border-2 ${
              environment === 'staging' ? 'border-[#FB5058]' :
              environment === 'production' ? 'border-[#2B81FC]' :
              'border-[#FABE00]'
            }`}>
              <span className="text-3xl">🍅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Test Report</h1>
              <p className="text-slate-500 text-lg">{feature.name}</p>
            </div>
            {/* Environment + Version + Pass Rate */}
            <div className="ml-auto flex items-center gap-4">
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
              {availableRuns.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-slate-700">Version:</label>
                  <Select value={selectedRun?.id || ''} onValueChange={(value) => {
                    const run = availableRuns.find(r => r.id === value);
                    if (run) setSelectedRun(run);
                  }}>
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRuns.map(run => (
                        <SelectItem key={run.id} value={run.id}>
                          {run.version} ({new Date(run.createdAt).toLocaleDateString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Pass Rate badge */}
              <div className="text-center px-4 py-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl text-white shadow">
                <div className="text-lg font-bold">{passRate}%</div>
                <div className="text-[11px] opacity-90">Pass Rate</div>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Completed: {new Date(selectedRun.completedAt || selectedRun.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Summary Stats - Clickable */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div 
            onClick={() => setStatusFilter('all')}
            className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${
              statusFilter === 'all' ? 'bg-blue-100 ring-2 ring-blue-300' : 'bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <div className="text-3xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-xs text-slate-600 mt-1">Total Scenarios</div>
          </div>
          <div 
            onClick={() => setStatusFilter('passed')}
            className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${
              statusFilter === 'passed' ? 'bg-emerald-100 ring-2 ring-emerald-300' : 'bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <div className="text-3xl font-bold text-emerald-600">{summary.passed}</div>
            <div className="text-xs text-slate-600 mt-1">Passed</div>
          </div>
          <div 
            onClick={() => setStatusFilter('failed')}
            className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${
              statusFilter === 'failed' ? 'bg-rose-100 ring-2 ring-rose-300' : 'bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <div className="text-3xl font-bold text-rose-600">{summary.failed}</div>
            <div className="text-xs text-slate-600 mt-1">Failed</div>
          </div>
          <div 
            onClick={() => setStatusFilter('skipped')}
            className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${
              statusFilter === 'skipped' ? 'bg-yellow-100 ring-2 ring-yellow-300' : 'bg-yellow-50 hover:bg-yellow-100'
            }`}
          >
            <div className="text-3xl font-bold text-yellow-600">{summary.skipped}</div>
            <div className="text-xs text-slate-600 mt-1">Skipped</div>
          </div>
          <div 
            onClick={() => setStatusFilter('untested')}
            className={`text-center p-4 rounded-xl shadow-md cursor-pointer transition-all ${
              statusFilter === 'untested' ? 'bg-slate-600 ring-2 ring-slate-400 text-white' : 'bg-slate-500 hover:bg-slate-600 text-white'
            }`}
          >
            <div className="text-3xl font-bold">{summary.untested}</div>
            <div className="text-xs mt-1 opacity-90">Untested</div>
          </div>
        </div>
        {/* Untested moved into the top row */}

        {/* Scenario Details with Accordion */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Scenario Details</h2>
          <div className="space-y-3">
            {filteredScenarios.map((scenario, index) => {
              const isExpanded = expandedScenarios.has(scenario.id);
              const getKeywordColor = (keyword: string) => {
                const kw = keyword.toLowerCase();
                if (kw === 'given') return 'bg-[#2B81FC]';
                if (kw === 'when') return 'bg-[#FB5058]';
                if (kw === 'then') return 'bg-[#9C006D]';
                return 'bg-[#00A396]';
              };
              
              return (
                <div key={scenario.id} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all">
                  {/* Scenario Header - Clickable */}
                  <div 
                    onClick={() => toggleScenario(scenario.id)}
                    className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                      <h3 className="font-bold text-lg text-slate-800">{scenario.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      scenario.status === 'passed' ? 'bg-emerald-100 text-emerald-700' :
                      scenario.status === 'failed' ? 'bg-rose-100 text-rose-700' :
                      scenario.status === 'skipped' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-600 text-white'
                    }`}>
                      {scenario.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Scenario Steps - Expandable */}
                  {isExpanded && (
                    <div className="p-4 space-y-2 bg-white">
                      {/* Scenario note & attachments */}
                      {(scenario as any).note && (
                        <div className="mb-2 text-sm text-slate-700"><span className="font-semibold">Note:</span> {(scenario as any).note}</div>
                      )}
                      {(scenario as any).attachments?.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-3">
                          {(scenario as any).attachments.map((att: any) => (
                            <a key={att.id} href={att.url} target="_blank" className="text-xs underline text-slate-700">{att.name}</a>
                          ))}
                        </div>
                      )}
                      {scenario.steps.map((step, stepIndex) => {
                        const getStepColor = () => {
                          if (step.result === 'passed') return 'bg-emerald-50 border-emerald-200';
                          if (step.result === 'failed') return 'bg-rose-50 border-rose-200';
                          if (step.result === 'skipped') return 'bg-yellow-50 border-yellow-200';
                          return 'bg-slate-50 border-slate-200';
                        };
                        
                        return (
                          <div key={step.id} className={`flex flex-col gap-2 p-3 rounded-lg border ${getStepColor()}`}>
                            <div className="flex-shrink-0">
                              <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getKeywordColor(step.keyword)}`}>
                                {step.keyword.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-800">{step.text}</p>
                              {step.note && (
                                <div className="mt-1 text-xs text-slate-700"><span className="font-semibold">Note:</span> {step.note}</div>
                              )}
                              {step.attachments && step.attachments.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-3">
                                  {step.attachments.map(att => (
                                    <a key={att.id} href={att.url} target="_blank" className="text-xs underline text-slate-700">{att.name}</a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Version Comparison Chart */}
        {availableRuns.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Version Comparison</h2>
            <div className="space-y-6">
              {availableRuns.map((run, index) => (
                <div key={run.id} className="border-2 border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{run.version}</h3>
                      <p className="text-xs text-slate-500">{new Date(run.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{run.summary.total}</div>
                        <div className="text-slate-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-emerald-600">{run.summary.passed}</div>
                        <div className="text-slate-500">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-rose-600">{run.summary.failed}</div>
                        <div className="text-slate-500">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600">{run.summary.skipped}</div>
                        <div className="text-slate-500">Skipped</div>
                      </div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    {run.summary.total > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div className="h-full flex">
                            <div className="bg-emerald-500" style={{ width: `${(run.summary.passed / run.summary.total) * 100}%` }}></div>
                            <div className="bg-rose-500" style={{ width: `${(run.summary.failed / run.summary.total) * 100}%` }}></div>
                            <div className="bg-yellow-500" style={{ width: `${(run.summary.skipped / run.summary.total) * 100}%` }}></div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {((run.summary.passed / run.summary.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
