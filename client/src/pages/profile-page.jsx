import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { PageShell } from '@/components/common/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UserRound, Mail, BadgeCheck, BriefcaseBusiness, Calendar, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

// Predefined avatar selections for user ease
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150",
];

export function ProfilePage() {
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    graduationYear: '',
    avatarUrl: '',
    skills: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        college: user.college || '',
        graduationYear: user.graduationYear || '',
        avatarUrl: user.avatarUrl || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        fullName: formData.fullName,
        college: formData.college,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
        avatarUrl: formData.avatarUrl,
        skills: formData.skills
      });
      setIsOpen(false);
    } catch (err) {
      console.error("Profile submit error", err);
    }
  };

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {/* Left Side: Profile Card */}
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-white/10">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <AvatarFallback>{user?.fullName?.slice(0, 2)?.toUpperCase() || 'P'}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <Badge variant="accent">Profile</Badge>
                <h1 className="mt-2 text-3xl font-semibold">{user?.fullName || 'PrepAI User'}</h1>
                <p className="text-sm text-muted-foreground">@{user?.userName || 'username'}</p>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{user?.email || '—'}</span>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{user?.college || 'College not set'}</span>
              </div>
              {user?.graduationYear && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>Class of {user.graduationYear}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>Role: <span className="capitalize">{user?.role || 'user'}</span></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(!user?.skills || user.skills.length === 0) ? (
                <span className="text-xs text-muted-foreground italic">No skills listed yet</span>
              ) : (
                user.skills.map((skill) => (
                  <Badge key={skill} variant="neutral" className="border-white/10 bg-white/5 text-slate-300">
                    {skill}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Account Actions */}
        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Identity surface</p>
                <h2 className="mt-1 text-2xl font-semibold">User Details & Tools</h2>
              </div>
              <UserRound className="h-5 w-5 text-amber-400" />
            </div>

            <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100">
              Manage your personal info, graduation info, target skills, and profile avatar image directly.
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="hover:bg-white/5 border border-white/10 text-white font-medium">
                    Update profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[420px] bg-[#14110d] border border-white/10 rounded-3xl p-6 shadow-2xl z-50">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white">Update Profile Details</DialogTitle>
                    <DialogDescription className="text-xs text-slate-400">
                      Modify details shown on your developer profile cards.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full bg-[#1b1712] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* College & Graduation Year */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">College / Univ.</label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                          className="w-full bg-[#1b1712] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
                          placeholder="MIT"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Class Year</label>
                        <input
                          type="number"
                          value={formData.graduationYear}
                          onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                          className="w-full bg-[#1b1712] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
                          placeholder="2026"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={formData.skills}
                        onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                        className="w-full bg-[#1b1712] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
                        placeholder="python, backend, algorithms"
                      />
                    </div>

                    {/* Preset Avatar Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Avatar Preset</label>
                      <div className="flex gap-3 py-1">
                        {AVATAR_PRESETS.map((url, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                            className={`relative h-10 w-10 rounded-full border-2 overflow-hidden transition-all ${formData.avatarUrl === url ? 'border-amber-500 scale-105' : 'border-white/5 opacity-70'
                              }`}
                          >
                            <img src={url} alt="preset avatar" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                        className="w-full bg-[#1b1712] border border-white/10 rounded-xl p-2.5 text-[10px] text-white placeholder-slate-600 outline-none focus:border-amber-500/50"
                        placeholder="Or input custom avatar image URL..."
                      />
                    </div>

                    <DialogFooter className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs px-4 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="rounded-xl bg-amber-500 text-black hover:bg-amber-400 text-xs font-semibold px-4 py-2 shadow-md shadow-amber-500/10"
                      >
                        {isUpdatingProfile ? 'Saving...' : 'Save changes'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                variant="secondary"
                className="hover:bg-white/5 border border-white/10 text-white font-medium"
                onClick={() => {
                  setIsOpen(true);
                  // preset avatar field is pre-focused
                }}
              >
                Change Avatar
              </Button>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#14110d] p-5 text-sm text-muted-foreground">
              Future profile tools such as resume alignment, target company preferences, and skill clusters can live here without changing the design language.
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}