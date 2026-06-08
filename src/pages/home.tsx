import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Loader2,
  LogOut,
  BookOpen,
  Award,
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  Search,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate('/login');
    }
  }, [session, isPending, navigate]);

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate('/login');
            toast.success('Logged out successfully');
          },
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to log out');
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm font-medium tracking-wide text-slate-400">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Sample data for research dashboard
  const stats = [
    {
      name: 'Research Projects',
      value: '12 Active',
      icon: BookOpen,
      color: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      name: 'Innovations Generated',
      value: '4 Registered',
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      name: 'Total Funding Received',
      value: 'Rp 120M',
      icon: DollarSign,
      color: 'text-amber-400 bg-amber-500/10',
    },
    {
      name: 'Impact Factor',
      value: '3.84 Avg',
      icon: TrendingUp,
      color: 'text-rose-400 bg-rose-500/10',
    },
  ];

  const recentResearch = [
    {
      id: 1,
      title: 'Analisis Sentimen Kebijakan Publik Menggunakan Model LSTM',
      author: 'Torikh Abdullah Naser',
      status: 'Approved',
      date: 'May 20, 2026',
    },
    {
      id: 2,
      title: 'Penerapan Sistem IoT Pada Budidaya Hidroponik Skala Rumah Tangga',
      author: 'Ahmad Faisal',
      status: 'Under Review',
      date: 'May 18, 2026',
    },
    {
      id: 3,
      title:
        'Rancang Bangun Aplikasi SIRIS Menggunakan Cloudflare Workers & React',
      author: 'Torikh Abdullah Naser',
      status: 'Draft',
      date: 'May 15, 2026',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SIRIS Portal
              </span>
            </div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full border border-slate-800"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
                    {session.user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-slate-200">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {(session.user as { role?: string }).role || 'User'}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl border border-slate-900 bg-gradient-to-r from-slate-900/60 to-slate-900/20 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Welcome back, {session.user.name.split(' ')[0]}! 👋
              </h1>
              <p className="mt-2 text-slate-400">
                Here is an overview of research, methodology validation, and
                innovation tracking in your workspace.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium rounded-xl px-5 py-5 gap-2 shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:-translate-y-0.5">
                <Plus className="h-4 w-4" /> New Proposal
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="rounded-xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-xl hover:border-slate-800 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{stat.name}</span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold tracking-tight text-white">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Submissions */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              Recent Research Proposals
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search research..."
                aria-label="Search research"
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-900 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-800 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-400 font-medium">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {recentResearch.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-200 max-w-md truncate">
                      {item.title}
                    </td>
                    <td className="py-4 px-4">{item.author}</td>
                    <td className="py-4 px-4 text-slate-400">{item.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.status === 'Under Review'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
