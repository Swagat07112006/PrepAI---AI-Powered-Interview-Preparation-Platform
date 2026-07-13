import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  WandSparkles,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  Target,
  ChevronRight,
  Lightbulb,
  Building,
  GraduationCap,
  Hammer,
  Trash2,
  UploadCloud,
  FileText,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

import { PageShell } from '@/components/common/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { futureNavigation } from '@/constants/navigation';
import { useAIRoadmapMutation, useAIRoadmapHistory, useAIDeleteRoadmapMutation, useAIExplainMutation, useAIExplainHistory, useAIDeleteExplainMutation, useAIResumeReviewMutation, useAIResumeHistory, useAIDeleteResumeMutation, useAIStartMockMutation, useAIMockHistory, useAIDeleteMockMutation, useAIEvaluateMockMutation } from '@/hooks/useAi';
import { useQuestions } from '@/hooks/useQuestions';
import { toast } from 'sonner';



const copy = {
  assistant: ['Ask for hints, explanations, and mock follow-up questions.', 'Responds with concise, role-aware guidance.'],
  roadmap: ['Turn weakness patterns into a study route.', 'Prioritize topics by urgency and confidence.'],
  'question-generator': ['Generate practice prompts from a topic or company.', 'Tuned for coding interviews and system design drills.'],
  'resume-analyzer': ['Map resume bullets to likely interview pressure points.', 'Identify missing evidence and gaps.'],
  'note-summarizer': ['Compress long notes into distilled recall recall cards.', 'Preserve the important signals and follow-up actions.'],
  'interview-simulator': ['Run realistic mock interview flows with feedback.', 'Designed for timed rounds and behavioral practice.'],
  'company-hub': ['Collect company-specific prep material in one place.', 'Keep notes, questions, and company insights together.'],
};

export function FutureAiPage() {
  const { slug } = useParams();
  const match = useMemo(() => futureNavigation.find((item) => item.href.endsWith(slug || '')) || futureNavigation[0], [slug]);
  const points = copy[slug] || ['This screen is fully designed but awaits backend integration.', 'No API is invented or faked here.'];

  // Form states for Roadmap
  const [targetCompany, setTargetCompany] = useState('');
  const [role, setRole] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Mid-Level');
  const [timeAvailable, setTimeAvailable] = useState('4 weeks');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [skills, setSkills] = useState('');
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [leftView, setLeftView] = useState('configure'); // 'configure' or 'history'

  const roadmapMutation = useAIRoadmapMutation();
  const deleteRoadmapMutation = useAIDeleteRoadmapMutation();
  const { data: historyList, isLoading: isLoadingHistory } = useAIRoadmapHistory();

  // Form states for AI Assistant
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [generatedExplanation, setGeneratedExplanation] = useState(null);
  const [assistantLeftView, setAssistantLeftView] = useState('configure');

  const explainMutation = useAIExplainMutation();
  const deleteExplainMutation = useAIDeleteExplainMutation();
  const { data: explainHistoryList, isLoading: isLoadingExplainHistory } = useAIExplainHistory();
  const { data: questionsListData } = useQuestions({ limit: 1000 });
  const questionsList = questionsListData?.data || [];

  // Form states for Resume Reviewer
  const [resumeFile, setResumeFile] = useState(null);
  const [generatedResumeReview, setGeneratedResumeReview] = useState(null);
  const [resumeLeftView, setResumeLeftView] = useState('configure');

  const resumeReviewMutation = useAIResumeReviewMutation();
  const deleteResumeMutation = useAIDeleteResumeMutation();
  const { data: resumeHistoryList, isLoading: isLoadingResumeHistory } = useAIResumeHistory();

  // Form states for Mock Interview Simulator
  const [mockCompany, setMockCompany] = useState('');
  const [mockRole, setMockRole] = useState('');
  const [mockDifficulty, setMockDifficulty] = useState('Medium');
  const [mockQuestionCount, setMockQuestionCount] = useState(3);
  const [mockLeftView, setMockLeftView] = useState('configure'); // 'configure' or 'history'

  const [currentMockInterview, setCurrentMockInterview] = useState(null);
  const [currentMockQuestionIdx, setCurrentMockQuestionIdx] = useState(0);
  const [mockAnswers, setMockAnswers] = useState({}); // { [questionIdx]: answerText }
  const [mockEvaluations, setMockEvaluations] = useState({}); // { [questionIdx]: evaluationObject }
  const [evaluatingQuestionIdx, setEvaluatingQuestionIdx] = useState(null);

  const startMockMutation = useAIStartMockMutation();
  const evaluateMockMutation = useAIEvaluateMockMutation();
  const deleteMockMutation = useAIDeleteMockMutation();
  const { data: mockHistoryList, isLoading: isLoadingMockHistory } = useAIMockHistory();

  const handleStartMock = async (e) => {
    e.preventDefault();
    if (!mockCompany || !mockRole) {
      toast.error('Please specify target company and interview role.');
      return;
    }

    try {
      const response = await startMockMutation.mutateAsync({
        company: mockCompany,
        role: mockRole,
        difficulty: mockDifficulty,
        questionCount: Number(mockQuestionCount)
      });

      // The response might be wraped in Axios or TanStack, but useAi hook does:
      // return response.data;
      // Wait, is response nested under another key?
      // Let's look at getAIResumeHistory or generateAIMockInterview returns.
      // ai.controller return: json(new ApiResponse(200, interview, "Mock Interview generated successfully"))
      // Fast check: in api.js, request wraps response.data.
      // In useAi, useMutation says:
      // const response = await aiApi.startMock(payload);
      // return response.data; // this returns raw data object!

      setCurrentMockInterview(response);
      setCurrentMockQuestionIdx(0);
      setMockAnswers({});
      setMockEvaluations({});
      setEvaluatingQuestionIdx(null);
      toast.success('Mock Interview successfully generated!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to generate mock interview');
    }
  };

  const handleEvaluateMock = async (questionIdx) => {
    const activeQuestion = currentMockInterview?.questions?.[questionIdx];
    if (!activeQuestion) return;

    const answer = mockAnswers[questionIdx] || '';
    if (!answer.trim()) {
      toast.error('Please write an answer before submitting for evaluation.');
      return;
    }

    try {
      setEvaluatingQuestionIdx(questionIdx);
      const response = await evaluateMockMutation.mutateAsync({
        question: activeQuestion.question,
        answer: answer
      });
      setMockEvaluations((prev) => ({
        ...prev,
        [questionIdx]: response
      }));
      toast.success('Answer evaluated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to evaluate answer');
    } finally {
      setEvaluatingQuestionIdx(null);
    }
  };

  const handleResumeReview = async (e) => {

    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please drag-and-drop or select a PDF resume file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await resumeReviewMutation.mutateAsync(formData);
      setGeneratedResumeReview(response);
      toast.success('AI Resume assessment computed successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to review resume');
    }
  };


  const handleExplainQuestion = async (e) => {
    e.preventDefault();
    let questionText = customQuestionText.trim();
    if (selectedQuestionId) {
      const matchedQ = questionsList.find(q => q._id === selectedQuestionId);
      if (matchedQ) {
        questionText = matchedQ.title;
        if (matchedQ.description) {
          questionText += `\n\nContext/Description:\n${matchedQ.description}`;
        }
      }
    }

    if (!questionText) {
      toast.error('Please select an existing workspace question or write a custom question.');
      return;
    }

    try {
      const response = await explainMutation.mutateAsync({ question: questionText });
      setGeneratedExplanation(response);
      toast.success('AI explanation generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to explain question');
    }
  };



  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!targetCompany || !role || !skills) {
      toast.error('Please fill in target company, role, and current skills.');
      return;
    }

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!skillsArray.length) {
      toast.error('Please enter at least one skill.');
      return;
    }

    try {
      const response = await roadmapMutation.mutateAsync({
        targetCompany,
        currentLevel,
        role,
        timeAvailable,
        hoursPerDay: Number(hoursPerDay),
        skills: skillsArray
      });
      setGeneratedRoadmap(response);
      toast.success('AI Roadmap generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to generate roadmap');
    }
  };

  // Render the functional AI Roadmap interface
  if (slug === 'roadmap') {
    return (
      <PageShell className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="accent" className="mb-2">Active AI Service</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
              Interview Prep Roadmap
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mt-1">
              Generate a personalized step-by-step interview preparation curriculum powered by Gemini-2.5-Flash.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Input Panel */}
          <Card className="border-white/10 bg-white/5 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Roadmap Workspace</CardTitle>
              <CardDescription>Tailor your study plan or view saved designs</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-black/25 p-1 border border-white/5 mb-4">
                <button
                  type="button"
                  onClick={() => setLeftView('configure')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${leftView === 'configure' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Configure
                </button>
                <button
                  type="button"
                  onClick={() => setLeftView('history')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${leftView === 'history' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Saved plans
                  {historyList && historyList.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black border border-[#14110d]">
                      {historyList.length}
                    </span>
                  )}
                </button>
              </div>

              {leftView === 'configure' ? (
                <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="e.g. Google, Stripe"
                        className="pl-9 h-11 rounded-2xl bg-white/5 border-white/10 text-white"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        disabled={roadmapMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Role</Label>
                    <div className="relative">
                      <Target className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="role"
                        placeholder="e.g. Frontend Engineer"
                        className="pl-9 h-11 rounded-2xl bg-white/5 border-white/10 text-white"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={roadmapMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="level" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Level</Label>
                      <Select value={currentLevel} onValueChange={setCurrentLevel} disabled={roadmapMutation.isPending}>
                        <SelectTrigger id="level" className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Staff+">Staff+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="time" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</Label>
                      <Select value={timeAvailable} onValueChange={setTimeAvailable} disabled={roadmapMutation.isPending}>
                        <SelectTrigger id="time" className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2 weeks">2 weeks</SelectItem>
                          <SelectItem value="4 weeks">4 weeks</SelectItem>
                          <SelectItem value="6 weeks">6 weeks</SelectItem>
                          <SelectItem value="8 weeks">8 weeks</SelectItem>
                          <SelectItem value="12 weeks">12 weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hours" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Study Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hours"
                        type="number"
                        min="1"
                        max="15"
                        className="pl-9 h-11 rounded-2xl bg-white/5 border-white/10 text-white"
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(e.target.value)}
                        disabled={roadmapMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skills" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Skills (comma separated)</Label>
                    <div className="relative">
                      <Hammer className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="skills"
                        placeholder="React, CSS, Algorithms"
                        className="pl-9 h-11 rounded-2xl bg-white/5 border-white/10 text-white"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        disabled={roadmapMutation.isPending}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={roadmapMutation.isPending}
                    className="w-full h-11 rounded-2xl bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-50 disabled:pointer-events-none font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {roadmapMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Analyzing and Mapping...
                      </>
                    ) : (
                      <>
                        <WandSparkles className="h-4 w-4" />
                        Generate Study Plan
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {isLoadingHistory ? (
                    <div className="py-12 text-center text-sm text-muted-foreground animate-pulse flex flex-col justify-center items-center gap-2">
                      <div className="h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      Loading history...
                    </div>
                  ) : !historyList || historyList.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No roadmaps generated yet. Generate your first plan to save it here!
                    </div>
                  ) : (
                    historyList.map((item) => (
                      <div key={item._id} className="flex gap-2 items-center w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedRoadmap(item.roadmap);
                            setTargetCompany(item.targetCompany || '');
                            setRole(item.role || '');
                            setCurrentLevel(item.currentLevel || 'Mid-Level');
                            setTimeAvailable(item.timeAvailable || '4 weeks');
                            setHoursPerDay(item.hoursPerDay || 2);
                            setSkills(Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''));
                            toast.success(`Loaded saved roadmap for ${item.targetCompany}`);
                          }}
                          className="flex-1 text-left rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-400/25 p-3 hover:bg-white/8 transition-all duration-200 space-y-1.5 min-w-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-white truncate max-w-[150px]">{item.targetCompany}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{item.role} • {item.currentLevel}</div>
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete the prep roadmap for ${item.targetCompany}?`)) {
                              try {
                                await deleteRoadmapMutation.mutateAsync(item._id);
                                toast.success('Roadmap plan deleted successfully');
                                if (generatedRoadmap && generatedRoadmap.overview === item.roadmap?.overview) {
                                  setGeneratedRoadmap(null);
                                }
                              } catch (err) {
                                toast.error('Failed to delete roadmap plan');
                              }
                            }
                          }}
                          className="p-2.5 rounded-2xl border border-white/5 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 transition duration-150 ease-in-out shrink-0"
                          title="Delete saved plan"
                          disabled={deleteRoadmapMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {!generatedRoadmap && !roadmapMutation.isPending && (
              <Card className="border-white/10 bg-white/5 py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="h-12 w-12 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/25 mb-4">
                  <Calendar className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Your Prep Schedule Appears Here</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Click 'Generate Study Plan' after setting your profile details to create an intelligent preparation checklist.
                </p>
              </Card>
            )}

            {roadmapMutation.isPending && (
              <Card className="border-white/10 bg-white/5 py-16 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-medium text-white animate-pulse mb-2">Architecting your Roadmap...</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Gemini is digesting {targetCompany} interview logs, mapping {role} core skills, and scaffolding a weekly spaced retention schedule.
                </p>
              </Card>
            )}

            {generatedRoadmap && !roadmapMutation.isPending && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Overview Header */}

                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-cyan-400" />
                      Roadmap Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {generatedRoadmap.overview}
                  </CardContent>
                </Card>

                {/* Tech Stack & Skills to Master */}
                {generatedRoadmap.techStack && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="p-4 sm:p-6 pb-2">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Hammer className="h-5 w-5 text-cyan-400" />
                        Target Tech Stack & Skill Guide
                      </CardTitle>
                      <CardDescription>Recommended skill trees and ecosystems to study for {targetCompany}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-2 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Languages */}
                        {generatedRoadmap.techStack.languages && generatedRoadmap.techStack.languages.length > 0 && (
                          <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Languages</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {generatedRoadmap.techStack.languages.map((lang, idx) => (
                                <Badge key={idx} className="bg-white/5 border border-white/10 text-white font-normal hover:bg-white/5">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Frameworks */}
                        {generatedRoadmap.techStack.frameworks && generatedRoadmap.techStack.frameworks.length > 0 && (
                          <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Frameworks & Libs</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {generatedRoadmap.techStack.frameworks.map((fw, idx) => (
                                <Badge key={idx} className="bg-white/5 border border-white/10 text-white font-normal hover:bg-white/5">{fw}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Databases */}
                        {generatedRoadmap.techStack.databases && generatedRoadmap.techStack.databases.length > 0 && (
                          <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Databases & Caching</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {generatedRoadmap.techStack.databases.map((db, idx) => (
                                <Badge key={idx} className="bg-white/5 border border-white/10 text-white font-normal hover:bg-white/5">{db}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Tools (DevOps/Platforms) */}
                        {generatedRoadmap.techStack.tools && generatedRoadmap.techStack.tools.length > 0 && (
                          <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Tools & Infrastructure</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {generatedRoadmap.techStack.tools.map((tool, idx) => (
                                <Badge key={idx} className="bg-white/5 border border-white/10 text-white font-normal hover:bg-white/5">{tool}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Weeks Timeline */}
                <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                  {generatedRoadmap.weeklyPlan?.map((week, idx) => (
                    <div key={idx} className="relative pl-14">
                      {/* Timeline dot */}
                      <span className="absolute left-[13px] top-1.5 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-cyan-400 bg-[#14110d] text-xs font-semibold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                        {week.week}
                      </span>

                      <Card className="border-white/10 bg-white/5 hover:border-cyan-400/25 transition">
                        <CardHeader className="p-4 sm:p-6">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <CardTitle className="text-md sm:text-lg text-white">Week {week.week}: {week.goal}</CardTitle>
                            <Badge variant="outline" className="border-cyan-400/20 text-cyan-400">Phase {idx + 1}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Core Topics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {week.topics?.map((topic, i) => (
                                <Badge key={i} className="bg-white/5 border border-white/10 text-white font-normal hover:bg-white/5">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {week.questions && week.questions.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-cyan-400" /> Recommended Questions
                              </h4>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {week.questions.map((q, i) => (
                                  <div key={i} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 p-3 text-sm text-foreground">
                                    <ChevronRight className="h-4 w-4 text-cyan-400" />
                                    {q}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {week.revision && (
                            <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 text-sm text-muted-foreground flex gap-3">
                              <Lightbulb className="h-5 w-5 text-yellow-400 shrink-0" />
                              <div>
                                <span className="font-semibold text-white block mb-0.5">Spaced Repetition Tip</span>
                                {week.revision}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Executive Tips */}
                {generatedRoadmap.tips && generatedRoadmap.tips.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-cyan-400" />
                        AI Strategic Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {generatedRoadmap.tips.map((tip, i) => (
                        <div key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                          <span className="text-cyan-400 font-semibold">•</span>
                          <p>{tip}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Render the functional AI Assistant interface
  if (slug === 'assistant') {
    return (
      <PageShell className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="accent" className="mb-2">Active AI Service</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
              AI Prep Assistant
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mt-1">
              Select or draft a question to get begin-friendly yet interview-focused intuition, edge-cases, common mistakes, solutions, and spaced retention hints.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Input & History Workspace Panel */}
          <Card className="border-white/10 bg-white/5 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Assistant Workspace</CardTitle>
              <CardDescription>Select questions or review save logs</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-black/25 p-1 border border-white/5 mb-4">
                <button
                  type="button"
                  onClick={() => setAssistantLeftView('configure')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${assistantLeftView === 'configure' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Ask AI
                </button>
                <button
                  type="button"
                  onClick={() => setAssistantLeftView('history')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${assistantLeftView === 'history' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Saved Queries
                  {explainHistoryList && explainHistoryList.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black border border-[#14110d]">
                      {explainHistoryList.length}
                    </span>
                  )}
                </button>
              </div>

              {assistantLeftView === 'configure' ? (
                <form onSubmit={handleExplainQuestion} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="activeQuestion" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Active Workspace Question</Label>
                    <Select value={selectedQuestionId} onValueChange={(val) => {
                      setSelectedQuestionId(val);
                      if (val) {
                        setCustomQuestionText(''); // clear custom text if selecting from list
                      }
                    }} disabled={explainMutation.isPending}>
                      <SelectTrigger id="activeQuestion" className="bg-white/5 border-white/10 text-white rounded-2xl h-11">
                        <SelectValue placeholder="-- Choose from your collection --" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[220px]">
                        <SelectItem value="_custom_">-- Type a Custom Question --</SelectItem>
                        {questionsList.map((q) => (
                          <SelectItem key={q._id} value={q._id}>
                            {q.title} {q.difficulty ? `(${q.difficulty})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(!selectedQuestionId || selectedQuestionId === '_custom_') && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <Label htmlFor="customQuestionText" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Custom Coding / System Design Question</Label>
                      <textarea
                        id="customQuestionText"
                        rows={6}
                        placeholder="Paste or write the interview problem prompt here..."
                        className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 resize-y"
                        value={customQuestionText}
                        onChange={(e) => setCustomQuestionText(e.target.value)}
                        disabled={explainMutation.isPending}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={explainMutation.isPending}
                    className="w-full h-11 rounded-2xl bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-50 disabled:pointer-events-none font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {explainMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Analyzing with Expert AI...
                      </>
                    ) : (
                      <>
                        <WandSparkles className="h-4 w-4" />
                        Explain Question
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {isLoadingExplainHistory ? (
                    <div className="py-12 text-center text-sm text-muted-foreground animate-pulse flex flex-col justify-center items-center gap-2">
                      <div className="h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      Loading saved history...
                    </div>
                  ) : !explainHistoryList || explainHistoryList.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No explanations saved yet. Ask a query to save it here!
                    </div>
                  ) : (
                    explainHistoryList.map((item) => (
                      <div key={item._id} className="flex gap-2 items-center w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedExplanation(item.explanation);
                            setCustomQuestionText(item.question);
                            setSelectedQuestionId('_custom_');
                            toast.success(`Loaded explanation log for question`);
                          }}
                          className="flex-1 text-left rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-400/25 p-3 hover:bg-white/8 transition-all duration-200 space-y-1.5 min-w-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-white truncate max-w-[170px]">{item.question.split('\n')[0]}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.explanation?.summary || 'AI Explanation view'}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete this explanation history record?`)) {
                              try {
                                await deleteExplainMutation.mutateAsync(item._id);
                                toast.success('Explanation record deleted');
                                if (generatedExplanation && generatedExplanation.summary === item.explanation?.summary) {
                                  setGeneratedExplanation(null);
                                }
                              } catch (err) {
                                toast.error('Failed to delete explanation');
                              }
                            }
                          }}
                          className="p-2.5 rounded-2xl border border-white/5 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 transition duration-150 ease-in-out shrink-0"
                          title="Delete saved plan"
                          disabled={deleteExplainMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Explanation Output / Panel */}
          <div className="space-y-6">
            {!generatedExplanation && !explainMutation.isPending && (
              <Card className="border-white/10 bg-white/5 py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="h-12 w-12 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/25 mb-4">
                  <BookOpen className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Your AI Explanation Dashboard</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Choose a workspace question or paste a custom prompt, then tap 'Explain Question' to parse step-by-step algorithms.
                </p>
              </Card>
            )}

            {explainMutation.isPending && (
              <Card className="border-white/10 bg-white/5 py-16 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-medium text-white animate-pulse mb-2">Analyzing algorithms...</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Gemini is mapping solution complexity graphs, tracing edge cases, compiling common interview bugs, and formatting spaced recall guides.
                </p>
              </Card>
            )}

            {generatedExplanation && !explainMutation.isPending && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Introduction & Summary */}
                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">Summary Overview</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground space-y-4">
                    <p>{generatedExplanation.summary}</p>
                    <div className="rounded-xl border border-white/5 bg-[#14110d] p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1.5">
                        <Lightbulb className="h-4 w-4 text-cyan-400" /> Intuition
                      </span>
                      <p className="text-slate-300 text-sm leading-6">{generatedExplanation.intuition}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Brute vs Optimal side-by-side */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Brute Force */}
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-md text-white font-semibold">Brute Force Approach</CardTitle>
                        <Badge variant="outline" className="border-slate-500/20 text-slate-400">Baseline</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      <div className="flex gap-2">
                        <div className="rounded-md border border-white/5 bg-[#14110d] px-2 py-1 text-[11px] text-muted-foreground text-center">
                          <span className="block text-[9px] uppercase font-semibold text-slate-500">Time</span>
                          <span className="font-mono text-white">{generatedExplanation.bruteForce?.timeComplexity || 'O(N^2)'}</span>
                        </div>
                        <div className="rounded-md border border-white/5 bg-[#14110d] px-2 py-1 text-[11px] text-muted-foreground text-center">
                          <span className="block text-[9px] uppercase font-semibold text-slate-500">Space</span>
                          <span className="font-mono text-white">{generatedExplanation.bruteForce?.spaceComplexity || 'O(1)'}</span>
                        </div>
                      </div>
                      <p className="text-xs leading-6 text-muted-foreground">{generatedExplanation.bruteForce?.approach}</p>
                    </CardContent>
                  </Card>

                  {/* Optimal approach */}
                  <Card className="border-cyan-400/20 bg-cyan-400/5">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-md text-cyan-300 font-semibold flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-cyan-400" /> Optimal Solution
                        </CardTitle>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">Recommended</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      <div className="flex gap-2">
                        <div className="rounded-md border border-cyan-400/10 bg-black/30 px-2 py-1 text-[11px] text-muted-foreground text-center">
                          <span className="block text-[9px] uppercase font-semibold text-cyan-400">Time</span>
                          <span className="font-mono text-cyan-300">{generatedExplanation.optimalSolution?.timeComplexity || 'O(N)'}</span>
                        </div>
                        <div className="rounded-md border border-cyan-400/10 bg-black/30 px-2 py-1 text-[11px] text-muted-foreground text-center">
                          <span className="block text-[9px] uppercase font-semibold text-cyan-400">Space</span>
                          <span className="font-mono text-cyan-300">{generatedExplanation.optimalSolution?.spaceComplexity || 'O(N)'}</span>
                        </div>
                      </div>
                      <p className="text-xs leading-6 text-slate-300">{generatedExplanation.optimalSolution?.approach}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Dry Run step trace */}
                {generatedExplanation.dryRun && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-md font-semibold text-white flex items-center gap-1.5">
                        <ChevronRight className="h-4.5 w-4.5 text-cyan-400" /> Walkthrough & Dry Run Simulation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs sm:text-sm leading-6 text-muted-foreground font-mono bg-black/30 rounded-xl p-4 border border-white/5">
                      <pre className="whitespace-pre-wrap">{generatedExplanation.dryRun}</pre>
                    </CardContent>
                  </Card>
                )}

                {/* Dynamic checklists and badges */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Edge Cases */}
                  {generatedExplanation.edgeCases && generatedExplanation.edgeCases.length > 0 && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" /> Crucial Edge Cases
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2.5 pt-2">
                        {generatedExplanation.edgeCases.map((ec, i) => (
                          <div key={i} className="flex gap-2 text-xs text-muted-foreground bg-[#14110d] border border-white/5 rounded-xl p-3">
                            <span className="text-cyan-400 font-bold block shrink-0">✓</span>
                            <span>{ec}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Common Pitfalls */}
                  {generatedExplanation.commonMistakes && generatedExplanation.commonMistakes.length > 0 && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <Target className="h-4 w-4" /> Common Mistakes & Gotchas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2.5 pt-2">
                        {generatedExplanation.commonMistakes.map((cm, i) => (
                          <div key={i} className="flex gap-2 text-xs text-muted-foreground bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                            <span className="text-rose-400 font-bold block shrink-0">!</span>
                            <span>{cm}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Patterns Involved */}
                {generatedExplanation.patterns && generatedExplanation.patterns.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardContent className="p-4 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patterns Map:</span>
                      <div className="flex flex-wrap gap-2">
                        {generatedExplanation.patterns.map((pat, idx) => (
                          <Badge key={idx} className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-medium hover:bg-cyan-500/15">{pat}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Similar Questions */}
                {generatedExplanation.similarQuestions && generatedExplanation.similarQuestions.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-cyan-400" /> Similar Challenge Prompts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2.5 pt-0">
                      {generatedExplanation.similarQuestions.map((q, i) => (
                        <div key={i} className="rounded-xl border border-white/5 bg-[#14110d] px-3.5 py-2 text-xs text-muted-foreground flex items-center gap-2 hover:border-cyan-400/10 hover:text-white transition cursor-default">
                          <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
                          {q}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Render the functional AI Resume Analyzer interface
  if (slug === 'resume-analyzer') {
    return (
      <PageShell className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="accent" className="mb-2">Active AI Service</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center gap-2">
              <UploadCloud className="h-8 w-8 text-cyan-400 animate-bounce" />
              AI Resume Evaluator
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mt-1">
              Upload your engineering resume to calculate ATS score, discover missing keywords, audit your project/experience phrasing, and view action items.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* File Dropzone & History Selector */}
          <Card className="border-white/10 bg-white/5 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Assessment Panel</CardTitle>
              <CardDescription>Upload PDF or consult past audits</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-black/25 p-1 border border-white/5 mb-4">
                <button
                  type="button"
                  onClick={() => setResumeLeftView('configure')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${resumeLeftView === 'configure' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Scan Resume
                </button>
                <button
                  type="button"
                  onClick={() => setResumeLeftView('history')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${resumeLeftView === 'history' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  History Logs
                  {resumeHistoryList && resumeHistoryList.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black border border-[#14110d]">
                      {resumeHistoryList.length}
                    </span>
                  )}
                </button>
              </div>

              {resumeLeftView === 'configure' ? (
                <form onSubmit={handleResumeReview} className="space-y-4">
                  {/* Styled Drag & Dropzone */}
                  {!resumeFile ? (
                    <div className="border border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 bg-white/5 hover:bg-white/8 transition duration-200 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setResumeFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-cyan-400 transition mb-3" />
                      <span className="text-sm font-semibold text-white block mb-1">Upload Resume File</span>
                      <span className="text-xs text-muted-foreground">Accepts PDF format (max 5MB)</span>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-white truncate">{resumeFile.name}</span>
                          <span className="block text-[11px] text-muted-foreground">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • PDF</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="flex-1 h-9 rounded-xl border border-white/10 text-muted-foreground hover:text-white text-xs font-semibold bg-white/5 transition"
                          disabled={resumeReviewMutation.isPending}
                        >
                          Change File
                        </button>
                        <button
                          type="submit"
                          disabled={resumeReviewMutation.isPending}
                          className="flex-2 px-4 h-9 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-semibold text-xs tracking-wide transition flex items-center justify-center gap-1.5"
                        >
                          {resumeReviewMutation.isPending ? (
                            <>
                              <div className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            'Analyze'
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!resumeFile && (
                    <div className="text-[11px] text-muted-foreground leading-relaxed bg-[#14110d] border border-white/5 rounded-xl p-3">
                      <span className="font-semibold text-white block mb-0.5">Privacy & Security</span>
                      Your resume is parsed locally and processed directly via Google Gemini AI. No documents are stored publicly or indexed.
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {isLoadingResumeHistory ? (
                    <div className="py-12 text-center text-sm text-muted-foreground animate-pulse flex flex-col justify-center items-center gap-2">
                      <div className="h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      Loading history logs...
                    </div>
                  ) : !resumeHistoryList || resumeHistoryList.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No resume analysis logs found. Scan a resume to see it here!
                    </div>
                  ) : (
                    resumeHistoryList.map((item) => {
                      const score = item.review?.atsScore || 0;
                      const badgeTheme = score >= 75
                        ? 'bg-amber-500/20 text-amber-355 border-amber-553/20'
                        : score >= 50
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

                      return (
                        <div key={item._id} className="flex gap-2 items-center w-full">
                          <button
                            type="button"
                            onClick={() => {
                              setGeneratedResumeReview(item.review);
                              setResumeFile({ name: item.fileName, size: 0 }); // stub file representation
                              toast.success(`Loaded history log: ${item.fileName}`);
                            }}
                            className="flex-1 text-left rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-400/25 p-3 hover:bg-white/8 transition-all duration-200 space-y-1.5 min-w-0"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-white truncate max-w-[150px]">{item.fileName}</span>
                              <Badge className={`${badgeTheme} text-[10px] px-1.5 py-0.5 border`}>
                                ATS: {score}
                              </Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex justify-between items-center">
                              <span>Checked on {new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete this resume evaluation log?`)) {
                                try {
                                  await deleteResumeMutation.mutateAsync(item._id);
                                  toast.success('Resume history record deleted');
                                  if (generatedResumeReview && generatedResumeReview.atsScore === item.review?.atsScore) {
                                    setGeneratedResumeReview(null);
                                  }
                                } catch (err) {
                                  toast.error('Failed to delete history record');
                                }
                              }
                            }}
                            className="p-2.5 rounded-2xl border border-white/5 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 transition duration-150 ease-in-out shrink-0"
                            title="Delete logs"
                            disabled={deleteResumeMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessment Output Panel */}
          <div className="space-y-6">
            {!generatedResumeReview && !resumeReviewMutation.isPending && (
              <Card className="border-white/10 bg-white/5 py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="h-12 w-12 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/25 mb-4">
                  <FileText className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Your Resume Assessment Center</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Upload a PDF version of your software engineering resume on the left to review metrics, strengths/weaknesses, and ATS guidelines.
                </p>
              </Card>
            )}

            {resumeReviewMutation.isPending && (
              <Card className="border-white/10 bg-white/5 py-16 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-medium text-white animate-pulse mb-2">Analyzing Resume Metrics...</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Gemini is parsing formatting checks, calculating your ATS score, auditing experience impact verbs, and screening database systems matches.
                </p>
              </Card>
            )}

            {generatedResumeReview && !resumeReviewMutation.isPending && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Score & Verdict Row */}
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                  {/* ATS Gauge */}
                  <Card className="border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 text-slate-400">ATS Score</span>
                    <div className="relative inline-flex items-center justify-center h-28 w-28 rounded-full border-4 border-cyan-400/30 flex-col bg-cyan-950/20 shadow-glow">
                      <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-pulse" />
                      <span className="text-3xl font-black text-white">{generatedResumeReview.atsScore}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">/ 100</span>
                    </div>
                  </Card>

                  {/* Final Verdict */}
                  <Card className="border-cyan-400/20 bg-cyan-400/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md text-cyan-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-cyan-400" /> Executive Verdict
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-slate-200">
                      <p>{generatedResumeReview.finalVerdict}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Resume Summary */}
                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-md font-semibold text-white">Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    <p>{generatedResumeReview.summary}</p>
                  </CardContent>
                </Card>

                {/* Missing Keywords Map */}
                {generatedResumeReview.missingKeywords && generatedResumeReview.missingKeywords.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-cyan-400" /> Recommended Keywords Search (ATS Boosters)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 pt-1 flex flex-wrap gap-2">
                      {generatedResumeReview.missingKeywords.map((kw, idx) => (
                        <Badge key={idx} className="bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-semibold tracking-wide px-2.5 py-1">
                          + {kw}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Strengths */}
                  {generatedResumeReview.strengths && generatedResumeReview.strengths.length > 0 && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" /> Strategic Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2.5 pt-2">
                        {generatedResumeReview.strengths.map((str, i) => (
                          <div key={i} className="flex gap-2 text-xs text-muted-foreground bg-[#14110d] border border-white/5 rounded-xl p-3">
                            <span className="text-amber-400 font-bold block shrink-0">✓</span>
                            <span>{str}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Weaknesses */}
                  {generatedResumeReview.weaknesses && generatedResumeReview.weaknesses.length > 0 && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <Target className="h-4 w-4" /> Identified Gaps / Weaknesses
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2.5 pt-2">
                        {generatedResumeReview.weaknesses.map((wk, i) => (
                          <div key={i} className="flex gap-2 text-xs text-muted-foreground bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                            <span className="text-rose-400 font-bold block shrink-0">!</span>
                            <span>{wk}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Section Specific Feedback */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Experience Phrasing Feedback */}
                  {generatedResumeReview.experienceFeedback && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                          <Building className="h-4 w-4 text-cyan-400" /> Work Experience Formatting
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs leading-6 text-muted-foreground pt-0">
                        <p>{generatedResumeReview.experienceFeedback}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Projects Auditing */}
                  {generatedResumeReview.projectFeedback && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                          <Hammer className="h-4 w-4 text-cyan-400" /> Projects Phrasing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs leading-6 text-muted-foreground pt-0">
                        <p>{generatedResumeReview.projectFeedback}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Technical skills */}
                  {generatedResumeReview.technicalSkillsFeedback && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                          <WandSparkles className="h-4 w-4 text-cyan-400" /> Skills Representation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs leading-6 text-muted-foreground pt-0">
                        <p>{generatedResumeReview.technicalSkillsFeedback}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Education feedback */}
                  {generatedResumeReview.educationFeedback && (
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader>
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-cyan-400" /> Education & Credentials
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs leading-6 text-muted-foreground pt-0">
                        <p>{generatedResumeReview.educationFeedback}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Improvements Action Guide */}
                {generatedResumeReview.improvements && generatedResumeReview.improvements.length > 0 && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-md font-semibold text-white">Step-by-step Actionable Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      {generatedResumeReview.improvements.map((imp, idx) => (
                        <div key={idx} className="flex gap-4 items-start text-sm text-muted-foreground">
                          <div className="h-6 w-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="leading-6">{imp}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Render the functional AI Mock Interview Simulator interface
  if (slug === 'interview-simulator') {
    const activeQuestion = currentMockInterview?.questions?.[currentMockQuestionIdx];
    const isEvaluatingActive = evaluatingQuestionIdx === currentMockQuestionIdx;
    const activeEvaluation = mockEvaluations[currentMockQuestionIdx];

    return (
      <PageShell className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="accent" className="mb-2">Active AI Service</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-cyan-400" />
              AI Mock Interview Simulator
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl mt-1">
              Select a target company, role, difficulty, and configure questions. Solve DSS, System Design, or Behavioral questions and get graded out of 10.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Settings Configuration & History Panel */}
          <Card className="border-white/10 bg-white/5 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Simulator Controller</CardTitle>
              <CardDescription>Launch new rounds or load former reviews</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-black/25 p-1 border border-white/5 mb-4">
                <button
                  type="button"
                  onClick={() => setMockLeftView('configure')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${mockLeftView === 'configure' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Configure
                </button>
                <button
                  type="button"
                  onClick={() => setMockLeftView('history')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${mockLeftView === 'history' ? 'bg-cyan-500 text-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                >
                  Saved Sessions
                  {mockHistoryList && mockHistoryList.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black border border-[#14110d]">
                      {mockHistoryList.length}
                    </span>
                  )}
                </button>
              </div>

              {mockLeftView === 'configure' ? (
                <form onSubmit={handleStartMock} className="space-y-4">
                  {/* Company Input */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs font-semibold">Target Company</Label>
                    <Input
                      placeholder="e.g. Google, Meta, Amazon"
                      value={mockCompany}
                      onChange={(e) => setMockCompany(e.target.value)}
                      className="bg-black/20 border-white/10 text-white rounded-xl focus:border-cyan-400 placeholder:text-muted-foreground/50 text-xs"
                      required
                    />
                  </div>

                  {/* Role Input */}
                  <div className="space-y-2">
                    <Label className="text-white text-xs font-semibold">Target Role / Domain</Label>
                    <Input
                      placeholder="e.g. Frontend Engineer, System Architect"
                      value={mockRole}
                      onChange={(e) => setMockRole(e.target.value)}
                      className="bg-black/20 border-white/10 text-white rounded-xl focus:border-cyan-400 placeholder:text-muted-foreground/50 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Difficulty */}
                    <div className="space-y-2">
                      <Label className="text-white text-xs font-semibold">Difficulty</Label>
                      <Select value={mockDifficulty} onValueChange={setMockDifficulty}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white rounded-xl text-xs h-9">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#14110d] border-white/10 text-white">
                          <SelectItem value="Easy" className="focus:bg-white/10 focus:text-white cursor-pointer">Easy</SelectItem>
                          <SelectItem value="Medium" className="focus:bg-white/10 focus:text-white cursor-pointer">Medium</SelectItem>
                          <SelectItem value="Hard" className="focus:bg-white/10 focus:text-white cursor-pointer">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Question Count */}
                    <div className="space-y-2">
                      <Label className="text-white text-xs font-semibold">Questions count</Label>
                      <Select value={String(mockQuestionCount)} onValueChange={(val) => setMockQuestionCount(Number(val))}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white rounded-xl text-xs h-9">
                          <SelectValue placeholder="Questions" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#14110d] border-white/10 text-white">
                          <SelectItem value="2" className="focus:bg-white/10 focus:text-white cursor-pointer">2 Problems</SelectItem>
                          <SelectItem value="3" className="focus:bg-white/10 focus:text-white cursor-pointer">3 Problems</SelectItem>
                          <SelectItem value="5" className="focus:bg-white/10 focus:text-white cursor-pointer">5 Problems</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={startMockMutation.isPending}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow disabled:opacity-50 h-10 mt-2"
                  >
                    {startMockMutation.isPending && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent shrink-0" />
                    )}
                    {startMockMutation.isPending ? 'Generating interview...' : 'Start Mock Interview'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  {isLoadingMockHistory ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                      <p className="text-xs text-muted-foreground mt-3">Loading session history...</p>
                    </div>
                  ) : !mockHistoryList || mockHistoryList.length === 0 ? (
                    <div className="text-center py-10 px-4 rounded-2xl bg-black/10 border border-white/5">
                      <p className="text-xs text-muted-foreground">No mock interview history logs found.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                      {mockHistoryList.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setCurrentMockInterview(item.interview);
                            setCurrentMockQuestionIdx(0);
                            setMockAnswers({});
                            setMockEvaluations({});
                            setMockCompany(item.company);
                            setMockRole(item.role);
                            setMockDifficulty(item.difficulty);
                            setMockQuestionCount(item.questionCount);
                            toast.success(`Loaded saved mock: ${item.company}`);
                          }}
                          className="w-full text-left rounded-xl p-3 bg-white/5 border border-white/5 hover:border-cyan-400/30 transition duration-200 cursor-pointer flex items-center justify-between group relative"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-white leading-none">
                              {item.company} <span className="text-[10px] text-cyan-400/80 font-normal">({item.difficulty})</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                              {item.role}
                            </p>
                            <p className="text-[9px] text-[#555] group-hover:text-muted-foreground/60 leading-none">
                              {new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>

                          <Button
                            size="lg"
                            variant="ghost"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this saved interview history log?')) {
                                try {
                                  await deleteMockMutation.mutateAsync(item._id);
                                  if (currentMockInterview?.title === item.interview?.title) {
                                    setCurrentMockInterview(null);
                                  }
                                  toast.success('Saved interview history erased.');
                                } catch (err) {
                                  toast.error(err.message || 'Failed to delete log');
                                }
                              }
                            }}
                            className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Core Simulator Slider Workspace */}
          <div className="space-y-6">
            {!currentMockInterview ? (
              <Card className="border-white/10 bg-white/5 text-center p-8 sm:p-12 min-h-[400px] flex flex-col items-center justify-center">
                <Sparkles className="h-12 w-12 text-cyan-400 mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-white">No Mock Session Running</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Specify details in the Controller pane, choose difficulty, and click **Start Mock Interview** to spin up Gemini-powered structured questions.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-lg w-full text-left">
                  <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-white">🎯 Dynamic Sourcing</p>
                    <p>Problems matching Google/Meta frameworks.</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-white">📝 Code & Behavioral</p>
                    <p>Formulate full solutions via markdown.</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#14110d] p-4 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-white">📊 Precision Score</p>
                    <p>Get instant strategic rubric breakdowns.</p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Steps and Stepper Card */}
                <div className="flex gap-2 justify-between items-center bg-black/25 p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Question Progress:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {currentMockInterview.questions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentMockQuestionIdx(idx)}
                          className={`h-7 px-3 text-[11px] font-bold rounded-lg border transition duration-200 ${currentMockQuestionIdx === idx
                            ? 'bg-cyan-500 text-black border-cyan-400 shadow-glow'
                            : mockEvaluations[idx]
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                              : mockAnswers[idx]
                                ? 'bg-orange-500/10 border-orange-505/20 text-orange-300 hover:bg-orange-500/20'
                                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white'
                            }`}
                        >
                          Q{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-100 rounded-xl"
                    onClick={() => {
                      if (confirm("Quit simulator? Active responses will be lost.")) {
                        setCurrentMockInterview(null);
                      }
                    }}
                  >
                    Exit Session
                  </Button>
                </div>

                {/* Slider Question Card */}
                {activeQuestion && (
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex gap-1.5">
                          <Badge className="bg-cyan-500/15 border border-cyan-400/20 text-cyan-300 text-[10px] font-bold">
                            {activeQuestion.type || 'Technical'}
                          </Badge>
                          <Badge className="bg-white/5 border border-white/10 text-muted-foreground text-[10px]">
                            {activeQuestion.expectedDuration || '15 mins'}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold">
                          Problem {currentMockQuestionIdx + 1} of {currentMockInterview.questions.length}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white font-medium leading-relaxed">
                        {activeQuestion.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Monospace Input Editor */}
                      <div className="space-y-2">
                        <Label className="text-white text-xs font-semibold flex items-center justify-between">
                          <span>Your Solution / Answer</span>
                          <span className="text-[10px] font-normal text-muted-foreground">Markdown codeblocks supported</span>
                        </Label>
                        <textarea
                          placeholder="Type your response... Include explanation details, time/space trade-offs, and code blocks."
                          value={mockAnswers[currentMockQuestionIdx] || ''}
                          onChange={(e) => setMockAnswers(prev => ({
                            ...prev,
                            [currentMockQuestionIdx]: e.target.value
                          }))}
                          className="w-full min-h-[140px] max-h-[300px] bg-[#070f1e] border border-white/10 focus:border-cyan-400 rounded-xl p-4 text-xs font-mono text-zinc-200 outline-none leading-relaxed transition-all"
                        />
                      </div>

                      {/* Slider Navigation Row */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white rounded-xl text-xs px-3 h-8"
                            disabled={currentMockQuestionIdx === 0}
                            onClick={() => setCurrentMockQuestionIdx(prev => prev - 1)}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white rounded-xl text-xs px-3 h-8"
                            disabled={currentMockQuestionIdx === currentMockInterview.questions.length - 1}
                            onClick={() => setCurrentMockQuestionIdx(prev => prev + 1)}
                          >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          onClick={() => handleEvaluateMock(currentMockQuestionIdx)}
                          disabled={isEvaluatingActive || !(mockAnswers[currentMockQuestionIdx] || '').trim()}
                          className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs rounded-xl h-9 px-4 disabled:opacity-50 flex items-center gap-1.5 shadow-glow"
                        >
                          {isEvaluatingActive && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent shrink-0" />
                          )}
                          {isEvaluatingActive ? 'Evaluating...' : activeEvaluation ? 'Re-Evaluate Answer' : 'Submit & Grade Answer'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Score Grading Panel / Feedback Card */}
                {activeEvaluation && (
                  <div className="space-y-6">
                    {/* Score circular indicators / Summary verdict */}
                    <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                      {/* Circular indicator card */}
                      <Card className="border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center">
                        <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-2">Verdict Score</Label>
                        <div className="relative flex items-center justify-center">
                          {/* Pulsing visual glow */}
                          <div className={`absolute inset-0 rounded-full blur-md opacity-25 animate-pulse ${activeEvaluation.score >= 8 ? 'bg-amber-500' : activeEvaluation.score >= 5 ? 'bg-orange-500' : 'bg-rose-500'
                            }`} />

                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke={activeEvaluation.score >= 8 ? '#fbbf24' : activeEvaluation.score >= 5 ? '#f97316' : '#f43f5e'}
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray="251.2"
                              strokeDashoffset={251.2 - (251.2 * activeEvaluation.score) / 10}
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white leading-none">{activeEvaluation.score}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold mt-1">/ 10</span>
                          </div>
                        </div>
                      </Card>

                      {/* Summary card */}
                      <Card className="border-white/10 bg-white/5 flex flex-col justify-center">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-white">Evaluation Verdict</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs leading-6 text-muted-foreground">
                          <p>{activeEvaluation.summary}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Strengths & Weaknesses checklists */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Strengths strengths */}
                      {activeEvaluation.strengths && activeEvaluation.strengths.length > 0 && (
                        <Card className="border-white/10 bg-white/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <CheckCircle className="h-4 w-4" /> Strong Aspects
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2.5 pt-2">
                            {activeEvaluation.strengths.map((str, i) => (
                              <div key={i} className="flex gap-2 text-xs text-muted-foreground bg-[#14110d] border border-white/5 rounded-xl p-3">
                                <span className="text-amber-400 font-bold block shrink-0">✓</span>
                                <span>{str}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Weaknesses areas */}
                      {activeEvaluation.weaknesses && activeEvaluation.weaknesses.length > 0 && (
                        <Card className="border-white/10 bg-white/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <AlertTriangle className="h-4 w-4 animate-bounce" /> Improvement Gaps
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2.5 pt-2">
                            {activeEvaluation.weaknesses.map((wk, i) => (
                              <div key={i} className="flex gap-2 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
                                <span className="text-amber-400 font-bold block shrink-0">!</span>
                                <span>{wk}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Missing Details checklist */}
                    {activeEvaluation.missingPoints && activeEvaluation.missingPoints.length > 0 && (
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-rose-300 flex items-center gap-1.5">
                            <Target className="h-4 w-4 text-rose-400" /> Missing Core Points
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pb-4 pt-1">
                          {activeEvaluation.missingPoints.map((pt, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start text-xs text-muted-foreground bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl">
                              <span className="text-rose-400 font-bold block shrink-0">✕</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggested Model Ideal Solution */}
                    {activeEvaluation.idealAnswer && (
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-cyan-400" /> Suggested Ideal Response
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 pt-2">
                          <div className="bg-[#050b16] rounded-xl p-4 border border-white/5 max-h-[300px] overflow-y-auto">
                            <pre className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                              {activeEvaluation.idealAnswer}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actionable performance tips */}
                    {activeEvaluation.tips && activeEvaluation.tips.length > 0 && (
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                            <Lightbulb className="h-4 w-4 text-cyan-400" /> Actionable Delivery Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                          {activeEvaluation.tips.map((tip, idx) => (
                            <div key={idx} className="flex gap-3 items-start text-xs text-muted-foreground pl-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                              <p className="leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Render static design shells for other AI slugs
  return (

    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge variant="accent">Coming soon in v2.0</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white">{match.label}</h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              These AI surfaces are undergoing version 2 blueprint mapping. They will soon hook into their respective backend processing services.
            </p>
            <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100">
              Check out the active <Link to="/ai/roadmap" className="underline text-amber-400 font-semibold">AI Interview Roadmap</Link> module in this version!
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {points.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-[#14110d] p-4 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <p className="font-medium text-white">Future module scaffold</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#14110d] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Module status</p>
                <Badge variant="outline">Design complete</Badge>
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground font-normal">
                <div className="flex items-center gap-3"><WandSparkles className="h-4 w-4 text-amber-400" /> Clean UX transitions</div>
                <div className="flex items-center gap-3"><WandSparkles className="h-4 w-4 text-amber-400" /> Tailored custom options</div>
                <div className="flex items-center gap-3"><WandSparkles className="h-4 w-4 text-amber-400" /> Powered by Gemini LLM model</div>
              </div>
            </div>
            <Button variant="secondary" asChild className="w-full">
              <Link to="/ui/dashboard" onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
                Return to workspace <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}