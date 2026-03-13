import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Image as ImageIcon, 
  Award, 
  Users as ContributorsIcon, 
  PenTool, 
  FileText, 
  Layout, 
  Download, 
  LogOut, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Star, 
  ThumbsUp, 
  MessageSquare,
  Home,
  Menu,
  X,
  ArrowLeft,
  Camera,
  ExternalLink
} from 'lucide-react';
import { Writing, Official, Contributor, Editorial, Comment, AppData, WritingCategory, Score } from './types';
import { storage } from './services/storage';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-cadet-green text-white hover:bg-green-900',
    secondary: 'bg-cadet-gold text-white hover:bg-yellow-600',
    outline: 'border-2 border-cadet-green text-cadet-green hover:bg-cadet-green hover:text-white',
    ghost: 'text-cadet-green hover:bg-green-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input 
      {...props} 
      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cadet-green focus:border-transparent outline-none transition-all"
    />
  </div>
);

const TextArea = ({ label, ...props }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <textarea 
      {...props} 
      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cadet-green focus:border-transparent outline-none transition-all min-h-[120px]"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select 
      {...props} 
      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cadet-green focus:border-transparent outline-none transition-all"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, onChange, value, className = '' }: any) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Image URL or upload below..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cadet-green focus:border-transparent outline-none transition-all"
          />
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2 transition-all">
            <Camera size={18} />
            <span className="text-sm font-medium">Upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        {value && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button 
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

// --- Sub-views ---

const WritingList = ({ 
  type, 
  isTeacher = false, 
  data, 
  searchQuery, 
  addWriting, 
  setSelectedWriting, 
  deleteWriting 
}: { 
  type: 'Bangla' | 'English', 
  isTeacher?: boolean,
  data: AppData,
  searchQuery: string,
  addWriting: (type: 'Bangla' | 'English') => void,
  setSelectedWriting: (w: Writing) => void,
  deleteWriting: (id: string) => void
}) => {
  const filtered = data.writings.filter(w => 
    w.type === type && 
    (w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     w.writerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     w.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filtered.map(w => (
        <motion.div 
          key={w.id} 
          layoutId={w.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="cursor-pointer"
          onClick={() => setSelectedWriting(w)}
        >
          <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all border-t-4 border-cadet-green relative group">
            {!isTeacher && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWriting(w.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            )}
            {w.imageUrl && (
              <div className="h-32 md:h-40 overflow-hidden">
                <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className="p-4 md:p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <span className="text-[10px] md:text-xs font-bold text-cadet-gold uppercase tracking-wider">{w.category}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1 md:mb-2 line-clamp-2 font-serif">{w.title || 'Untitled'}</h3>
              <p className="text-slate-500 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3 flex-1">{w.content}</p>
              <div className="pt-3 md:pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs md:text-sm font-medium text-slate-600 truncate max-w-[100px]">By {w.writerName}</span>
                <span className="text-[10px] md:text-xs text-slate-400">#{w.cadetNumber}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-100">
          <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">No writings found in this category.</p>
          {!isTeacher && <Button variant="ghost" className="mt-4" onClick={() => addWriting(type)}>Add New Writing</Button>}
        </div>
      )}
    </div>
  );
};

const WritingDetail = ({ 
  writing, 
  onClose, 
  isTeacher = false,
  handleScore,
  updateWriting,
  deleteWriting,
  handleVote
}: { 
  writing: Writing, 
  onClose: () => void, 
  isTeacher?: boolean,
  handleScore: (writingId: string, score: Score) => void,
  updateWriting: (id: string, updates: Partial<Writing>) => void,
  deleteWriting: (id: string) => void,
  handleVote: (writingId: string) => void
}) => {
  const [isScoring, setIsScoring] = useState(false);
  const [isEditing, setIsEditing] = useState(!writing.title && !isTeacher);
  const [editForm, setEditForm] = useState<Writing>(writing);
  const [scoreForm, setScoreForm] = useState({ creativity: 5, language: 5, presentation: 5, overall: 5, judgeName: '' });

  const totalScore = scoreForm.creativity + scoreForm.language + scoreForm.presentation + scoreForm.overall;

  const submitScore = () => {
    if (!scoreForm.judgeName) return alert('Please enter judge name');
    handleScore(writing.id, { ...scoreForm, total: totalScore });
    setIsScoring(false);
    alert('Score submitted successfully!');
  };

  const saveEdit = () => {
    updateWriting(writing.id, editForm);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-3 md:p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={onClose} className="p-1 md:p-2 hover:bg-slate-100 rounded-full transition-all">
              <X size={20} md:size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
              {isEditing ? `Editing ${writing.type}` : writing.title}
            </h2>
          </div>
          <div className="flex gap-1 md:gap-2">
            {!isTeacher && (
              <>
                {!isEditing && <Button variant="secondary" className="text-xs md:text-sm px-2 md:px-4" onClick={() => setIsEditing(true)}><Edit3 size={16} md:size={18} /> <span className="hidden sm:inline">Edit</span></Button>}
                <Button variant="danger" className="text-xs md:text-sm px-2 md:px-4" onClick={() => deleteWriting(writing.id)}><Trash2 size={16} md:size={18} /> <span className="hidden sm:inline">Delete</span></Button>
              </>
            )}
            {isEditing && (
              <>
                <Button variant="ghost" className="text-xs md:text-sm px-2 md:px-4" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" className="text-xs md:text-sm px-2 md:px-4" onClick={saveEdit}>Save</Button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 md:p-8">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Writing Title" value={editForm.title} onChange={(e: any) => setEditForm({ ...editForm, title: e.target.value })} />
                <Input label="Writer Name" value={editForm.writerName} onChange={(e: any) => setEditForm({ ...editForm, writerName: e.target.value })} />
                <Input label="Cadet Number" value={editForm.cadetNumber} onChange={(e: any) => setEditForm({ ...editForm, cadetNumber: e.target.value })} />
                <Select 
                  label="Category" 
                  value={editForm.category} 
                  onChange={(e: any) => setEditForm({ ...editForm, category: e.target.value as WritingCategory })}
                  options={[
                    { value: 'Poem', label: 'Poem' },
                    { value: 'Story', label: 'Story' },
                    { value: 'Drama', label: 'Drama' },
                    { value: 'Essay', label: 'Essay' },
                    { value: 'Article', label: 'Article' },
                    { value: 'Miscellaneous', label: 'Miscellaneous' },
                  ]}
                />
              </div>
              <FileInput label="Image (Optional)" value={editForm.imageUrl || ''} onChange={(val: string) => setEditForm({ ...editForm, imageUrl: val })} />
              <TextArea label="Writing Content" value={editForm.content} onChange={(e: any) => setEditForm({ ...editForm, content: e.target.value })} />
            </div>
          ) : (
            <>
              {writing.imageUrl && (
                <img src={writing.imageUrl} alt={writing.title} className="w-full h-auto max-h-[300px] md:max-h-[400px] object-cover rounded-xl mb-6 md:mb-8 shadow-lg" referrerPolicy="no-referrer" />
              )}
              
              <div className="flex flex-wrap gap-4 mb-6 md:mb-8 items-center justify-between border-b border-slate-100 pb-4 md:pb-6">
                <div>
                  <p className="text-slate-400 text-[10px] md:text-sm uppercase font-bold tracking-wider">Author</p>
                  <p className="text-lg md:text-xl font-serif text-slate-800">{writing.writerName || 'Unknown'} <span className="text-slate-400 text-xs md:text-sm font-sans">#{writing.cadetNumber || 'N/A'}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] md:text-sm uppercase font-bold tracking-wider">Category</p>
                  <p className="text-base md:text-lg font-medium text-cadet-green">{writing.category}</p>
                </div>
              </div>

              <div className="prose prose-slate md:prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-serif text-lg md:text-xl">
                {writing.content || 'No content yet.'}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'welcome' | 'login' | 'cadet-dashboard' | 'teacher-dashboard' | 'magazine-layout'>('welcome');
  const [data, setData] = useState<AppData>(storage.getData());
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null);

  // Teacher Portal States
  const [teacherRole, setTeacherRole] = useState('Principal');
  const [judgeName, setJudgeName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  useEffect(() => {
    storage.saveData(data);
  }, [data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    if (email === 'fh1963@gmail.com' && password === 'hpfh1963') {
      setUser({ email, role: 'cadet' });
      setView('cadet-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setView('welcome');
  };

  // --- Render Functions ---

  const renderWelcome = () => (
    <div className="min-h-screen bg-cadet-green flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-cadet-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-cadet-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 w-full max-w-4xl"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-2xl border-4 border-cadet-gold">
          <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-cadet-green" />
        </div>
        <h1 className="text-3xl md:text-6xl text-white font-bold mb-2 tracking-tight">Mirzapur Cadet College</h1>
        <h2 className="text-xl md:text-3xl text-cadet-gold font-serif italic mb-8 md:mb-12">Fazlul Haque House Wall Magazine</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('login')}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-cadet-green/10 rounded-full flex items-center justify-center group-hover:bg-cadet-green group-hover:text-white transition-all">
              <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-cadet-green group-hover:text-white" />
            </div>
            <div className="text-center">
              <span className="block text-xl md:text-2xl font-bold text-slate-800">Cadets Portal</span>
              <span className="text-slate-500 text-xs md:text-sm">Login to manage content</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('teacher-dashboard')}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-cadet-gold/10 rounded-full flex items-center justify-center group-hover:bg-cadet-gold group-hover:text-white transition-all">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-cadet-gold group-hover:text-white" />
            </div>
            <div className="text-center">
              <span className="block text-xl md:text-2xl font-bold text-slate-800">Teachers Portal</span>
              <span className="text-slate-500 text-xs md:text-sm">View and judge magazine</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-4 md:bottom-8 text-white/60 text-xs md:text-sm">
        &copy; 2026 Fazlul Haque House. All Rights Reserved.
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 md:p-8">
          <button onClick={() => setView('welcome')} className="text-slate-400 hover:text-cadet-green mb-4 md:mb-6 flex items-center gap-1 text-sm md:text-base">
            <ArrowLeft size={16} md:size={18} /> Back
          </button>
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Cadet Login</h2>
            <p className="text-slate-500 text-sm md:text-base">Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email Address" name="email" type="email" required defaultValue="fh1963@gmail.com" />
            <Input label="Password" name="password" type="password" required defaultValue="hpfh1963" />
            <Button type="submit" className="w-full py-2 md:py-3 text-base md:text-lg mt-2">
              Login to Dashboard
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );

  // --- Dashboard Logic ---

  const addWriting = (type: 'Bangla' | 'English') => {
    const newWriting: Writing = {
      id: Date.now().toString(),
      title: 'New Writing',
      writerName: '',
      cadetNumber: '',
      category: 'Article',
      content: '',
      type,
      scores: [],
      votes: 0,
      createdAt: Date.now()
    };
    setData({ ...data, writings: [newWriting, ...data.writings] });
    setSelectedWriting(newWriting);
  };

  const updateWriting = (id: string, updates: Partial<Writing>) => {
    setData({
      ...data,
      writings: data.writings.map(w => w.id === id ? { ...w, ...updates } : w)
    });
  };

  const deleteWriting = (id: string) => {
    setData({ ...data, writings: data.writings.filter(w => w.id !== id) });
    setSelectedWriting(null);
  };

  const addContributor = () => {
    const newContributor: Contributor = {
      id: Date.now().toString(),
      nameBangla: '',
      nameEnglish: '',
      role: 'Writer'
    };
    setData({ ...data, contributors: [...data.contributors, newContributor] });
  };

  const updateContributor = (id: string, updates: Partial<Contributor>) => {
    setData({
      ...data,
      contributors: data.contributors.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const deleteContributor = (id: string) => {
    setData({ ...data, contributors: data.contributors.filter(c => c.id !== id) });
  };

  const updateOfficial = (id: string, updates: Partial<Official>) => {
    setData({
      ...data,
      officials: data.officials.map(o => o.id === id ? { ...o, ...updates } : o)
    });
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setData({ ...data, comments: [newComment, ...data.comments] });
  };

  const deleteComment = (id: string) => {
    setData({ ...data, comments: data.comments.filter(c => c.id !== id) });
  };

  const handleVote = (writingId: string) => {
    setData({
      ...data,
      writings: data.writings.map(w => w.id === writingId ? { ...w, votes: w.votes + 1 } : w)
    });
  };

  const handleScore = (writingId: string, score: Score) => {
    setData({
      ...data,
      writings: data.writings.map(w => w.id === writingId ? { ...w, scores: [...w.scores, score] } : w)
    });
  };

  const submitComment = () => {
    if (!commentText) return;
    if (editingComment) {
      setData({
        ...data,
        comments: data.comments.map(c => c.id === editingComment.id ? { ...c, role: teacherRole, judgeName: teacherRole === 'Judge' ? judgeName : undefined, text: commentText } : c)
      });
      setEditingComment(null);
    } else {
      addComment({
        role: teacherRole,
        judgeName: teacherRole === 'Judge' ? judgeName : undefined,
        text: commentText
      });
    }
    setCommentText('');
    setJudgeName('');
    alert(editingComment ? 'Comment updated!' : 'Comment submitted!');
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setTeacherRole(comment.role);
    setJudgeName(comment.judgeName || '');
    setCommentText(comment.text);
  };

  // --- Sub-views ---

  const renderCadetDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar / Nav */}
      <div className="bg-cadet-green text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg">
            <BookOpen className="text-cadet-green" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Cadet Dashboard</h1>
            <p className="text-xs text-white/60">Fazlul Haque House</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setView('magazine-layout')}>
            <Layout size={18} /> Preview Magazine
          </Button>
          <Button variant="danger" className="bg-red-500/20 hover:bg-red-500" onClick={logout}>
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-white border-r border-slate-200 p-4 hidden md:flex flex-col gap-2 overflow-y-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'bangla', icon: PenTool, label: 'Bangla Writings' },
            { id: 'english', icon: FileText, label: 'English Writings' },
            { id: 'images', icon: ImageIcon, label: 'Images' },
            { id: 'officials', icon: UserCheck, label: 'Acknowledgements' },
            { id: 'contributors', icon: ContributorsIcon, label: 'Contributors' },
            { id: 'editorial', icon: PenTool, label: 'Editorial' },
            { id: 'comments', icon: MessageSquare, label: 'Comments' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-cadet-green text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'home' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                  <h2 className="text-3xl font-bold text-cadet-green mb-4 font-serif">About the Wall Magazine</h2>
                  <p className="text-slate-700 text-lg leading-relaxed mb-8">
                    The Fazlul Haque House Wall Magazine is a prestigious tradition of Mirzapur Cadet College. 
                    It serves as a creative outlet for cadets to express their thoughts, literary talents, and artistic skills. 
                    This digital platform preserves our heritage and allows for a wider reach within our academic community.
                  </p>
                  
                  <div className="border-t-4 border-cadet-gold pt-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 uppercase tracking-widest">Editorial (সম্পাদকীয়)</h3>
                    {data.editorial.content ? (
                      <div className="relative overflow-hidden rounded-2xl p-12 shadow-inner border border-slate-100 bg-slate-50">
                        {data.editorial.backgroundImageUrl && (
                          <img src={data.editorial.backgroundImageUrl} alt="Editorial BG" className="absolute inset-0 w-full h-full object-cover opacity-10" referrerPolicy="no-referrer" />
                        )}
                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                          <p className="text-lg font-serif italic text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {data.editorial.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No editorial submitted yet.</p>
                    )}
                  </div>

                  <div className="border-t-4 border-cadet-gold pt-8 mt-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 uppercase tracking-widest">Full Wall Magazine Preview</h3>
                    {data.mainMagazineImage ? (
                      <div className="rounded-xl overflow-hidden shadow-2xl border-8 border-white">
                        <img src={data.mainMagazineImage} alt="Full Magazine" className="w-full h-auto" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-20 text-center text-slate-400">
                        <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                        <p>No magazine image uploaded yet. Go to "Images" tab to upload.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <FileText />
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">{data.writings.length}</span>
                      <span className="text-slate-500 text-sm">Total Writings</span>
                    </div>
                  </Card>
                  <Card className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                      <ImageIcon />
                    </div>
                    <div>
                      <span className="block text-2xl font-bold">{data.pictureCorner.length + (data.mainMagazineImage ? 1 : 0)}</span>
                      <span className="text-slate-500 text-sm">Images Uploaded</span>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" onClick={() => setActiveTab('bangla')}><Plus size={18} /> Bangla Writing</Button>
                      <Button variant="outline" onClick={() => setActiveTab('english')}><Plus size={18} /> English Writing</Button>
                      <Button variant="outline" onClick={() => setActiveTab('images')}><Camera size={18} /> Upload Image</Button>
                      <Button variant="outline" onClick={() => setView('magazine-layout')}><Layout size={18} /> Layout Gen</Button>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Editorial Preview</h3>
                    <div className="bg-slate-50 p-4 rounded-lg min-h-[100px] italic text-slate-600">
                      {data.editorial.content || 'No editorial written yet...'}
                    </div>
                    <Button variant="ghost" className="mt-4 w-full" onClick={() => setActiveTab('editorial')}>Edit Editorial</Button>
                  </Card>
                </div>
              </div>
            )}

            {(activeTab === 'bangla' || activeTab === 'english') && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-3xl font-bold text-slate-800 capitalize">{activeTab} Writings</h2>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search writings..." 
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-cadet-green"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <WritingList 
                  type={activeTab === 'bangla' ? 'Bangla' : 'English'} 
                  data={data}
                  searchQuery={searchQuery}
                  addWriting={addWriting}
                  setSelectedWriting={setSelectedWriting}
                  deleteWriting={deleteWriting}
                />
              </div>
            )}

            {activeTab === 'editorial' && (
              <Card className="p-8 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Editorial Section (Bangla)</h2>
                <TextArea 
                  label="Editorial Content" 
                  placeholder="Write the editorial in Bangla..." 
                  value={data.editorial.content} 
                  onChange={(e: any) => setData({ ...data, editorial: { ...data.editorial, content: e.target.value } })}
                />
                <FileInput 
                  label="Background Image" 
                  value={data.editorial.backgroundImageUrl || ''} 
                  onChange={(val: string) => setData({ ...data, editorial: { ...data.editorial, backgroundImageUrl: val } })}
                />
                {data.editorial.backgroundImageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden h-48 border border-slate-200">
                    <img src={data.editorial.backgroundImageUrl} alt="Editorial BG" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="mt-8 flex gap-4">
                  <Button className="flex-1" onClick={() => alert('Editorial saved!')}>Save Editorial</Button>
                  <Button variant="danger" onClick={() => setData({ ...data, editorial: { content: '', backgroundImageUrl: '' } })}>Clear</Button>
                </div>
              </Card>
            )}

            {activeTab === 'images' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Main Magazine Image</h2>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                      {data.mainMagazineImage ? (
                        <img src={data.mainMagazineImage} alt="Main" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImageIcon size={48} className="mx-auto mb-2" />
                          <p>No main image uploaded</p>
                        </div>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <FileInput 
                        label="Main Image" 
                        value={data.mainMagazineImage || ''} 
                        onChange={(val: string) => setData({ ...data, mainMagazineImage: val })}
                      />
                      <Input 
                        label="Full Magazine PDF URL (Optional)" 
                        placeholder="Enter PDF URL..." 
                        value={data.mainMagazinePdfUrl || ''} 
                        onChange={(e: any) => setData({ ...data, mainMagazinePdfUrl: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button className="flex-1">Save Main Image</Button>
                        <Button variant="danger" onClick={() => setData({ ...data, mainMagazineImage: '' })}>Remove</Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Picture Corner</h2>
                    <label className="cursor-pointer bg-cadet-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-900 transition-all">
                      <Plus size={18} />
                      <span className="font-medium">Add Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setData({ ...data, pictureCorner: [...data.pictureCorner, reader.result as string] });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.pictureCorner.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden shadow-md">
                        <img src={img} alt={`Corner ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Button variant="danger" className="p-2 rounded-full" onClick={() => setData({ ...data, pictureCorner: data.pictureCorner.filter((_, i) => i !== idx) })}>
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {data.pictureCorner.length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        No images in Picture Corner yet.
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'officials' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Acknowledgements (Officials)</h2>
                  <Button onClick={() => {
                    const newOff: Official = { id: Date.now().toString(), name: '', designation: 'New Official' };
                    setData({ ...data, officials: [...data.officials, newOff] });
                  }}><Plus size={18} /> Add Official</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.officials.map(off => (
                    <Card key={off.id} className="p-6 relative group">
                      <button 
                        onClick={() => {
                          setData({ ...data, officials: data.officials.filter(o => o.id !== off.id) });
                        }}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                          {off.photoUrl ? (
                            <img src={off.photoUrl} alt={off.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <UserCheck size={32} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <Input 
                            placeholder="Designation" 
                            value={off.designation} 
                            onChange={(e: any) => updateOfficial(off.id, { designation: e.target.value })}
                          />
                          <Input 
                            placeholder="Official Name" 
                            value={off.name} 
                            onChange={(e: any) => updateOfficial(off.id, { name: e.target.value })}
                          />
                          <FileInput 
                            label="Photo" 
                            value={off.photoUrl || ''} 
                            onChange={(val: string) => updateOfficial(off.id, { photoUrl: val })}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contributors' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Contributors</h2>
                  <Button onClick={addContributor}><Plus size={18} /> Add Contributor</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.contributors.map(c => (
                    <Card key={c.id} className="p-6 relative group">
                      <button 
                        onClick={() => deleteContributor(c.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Name (Bangla)" value={c.nameBangla} onChange={(e: any) => updateContributor(c.id, { nameBangla: e.target.value })} />
                          <Input label="Name (English)" value={c.nameEnglish} onChange={(e: any) => updateContributor(c.id, { nameEnglish: e.target.value })} />
                        </div>
                        <Select 
                          label="Role" 
                          value={c.role} 
                          onChange={(e: any) => updateContributor(c.id, { role: e.target.value })}
                          options={[
                            { value: 'Writer', label: 'Writer' },
                            { value: 'Editor', label: 'Editor' },
                            { value: 'Designer', label: 'Designer' },
                            { value: 'Photographer', label: 'Photographer' },
                            { value: 'Coordinator', label: 'Coordinator' },
                          ]}
                        />
                      </div>
                    </Card>
                  ))}
                  {data.contributors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      No contributors added yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Teacher Comments</h2>
                <div className="space-y-4">
                  {data.comments.map(c => (
                    <Card key={c.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="px-2 py-1 bg-cadet-gold/20 text-cadet-gold text-xs font-bold rounded uppercase mr-2">{c.role}</span>
                          {c.judgeName && <span className="font-bold text-slate-800">{c.judgeName}</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                          <button onClick={() => deleteComment(c.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <p className="text-slate-700 italic">"{c.text}"</p>
                    </Card>
                  ))}
                  {data.comments.length === 0 && (
                    <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                      No comments from teachers yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Writing Editor Modal */}
      <AnimatePresence>
        {selectedWriting && (
          <WritingDetail 
            writing={selectedWriting} 
            onClose={() => setSelectedWriting(null)} 
            isTeacher={user?.role !== 'cadet'}
            handleScore={handleScore}
            updateWriting={updateWriting}
            deleteWriting={deleteWriting}
            handleVote={handleVote}
          />
        )}
      </AnimatePresence>
    </div>
  );

  const renderTeacherDashboard = () => {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-cadet-green text-white p-3 md:p-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white p-1 rounded-lg">
              <Users className="text-cadet-green" size={20} md:size={24} />
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-lg leading-tight">Teachers Portal</h1>
              <p className="text-[10px] md:text-xs text-white/60">Mirzapur Cadet College</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 text-xs md:text-sm px-2 md:px-4" onClick={() => setView('magazine-layout')}>
              <Layout size={16} md:size={18} /> <span className="hidden sm:inline">Digital Magazine</span>
            </Button>
            <Button variant="secondary" className="text-xs md:text-sm px-2 md:px-4" onClick={() => setView('welcome')}>
              <ArrowLeft size={16} md:size={18} /> <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
            
            {/* Home Section (Intro + Magazine) */}
            <section className="bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-slate-100">
              <h2 className="text-2xl md:text-3xl font-bold text-cadet-green mb-4 font-serif">About the Wall Magazine</h2>
              <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                The Fazlul Haque House Wall Magazine is a prestigious tradition of Mirzapur Cadet College. 
                It serves as a creative outlet for cadets to express their thoughts, literary talents, and artistic skills. 
                This digital platform preserves our heritage and allows for a wider reach within our academic community.
              </p>
              
              <div className="border-t-4 border-cadet-gold pt-6 md:pt-8 mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-slate-800 uppercase tracking-widest">Editorial (সম্পাদকীয়)</h3>
                {data.editorial.content ? (
                  <div className="relative overflow-hidden rounded-2xl p-6 md:p-12 shadow-inner border border-slate-100 bg-slate-50">
                    {data.editorial.backgroundImageUrl && (
                      <img src={data.editorial.backgroundImageUrl} alt="Editorial BG" className="absolute inset-0 w-full h-full object-cover opacity-10" referrerPolicy="no-referrer" />
                    )}
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                      <p className="text-base md:text-lg font-serif italic text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {data.editorial.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No editorial submitted yet by cadets.</p>
                )}
              </div>

              <div className="border-t-4 border-cadet-gold pt-6 md:pt-8">
                <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-slate-800 uppercase tracking-widest">Full Wall Magazine Preview</h3>
                {data.mainMagazineImage ? (
                  <div className="rounded-xl overflow-hidden shadow-2xl border-4 md:border-8 border-white">
                    <img src={data.mainMagazineImage} alt="Full Magazine" className="w-full h-auto" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-12 md:py-20 text-center text-slate-400">
                    <ImageIcon size={48} md:size={64} className="mx-auto mb-4 opacity-20" />
                    <p>No magazine image uploaded yet by cadets.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Stats / Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <h3 className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Total Submissions</h3>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">{data.writings.length}</p>
              </Card>
              <Card className="p-4 md:p-6">
                <h3 className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Teacher Comments</h3>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">{data.comments.length}</p>
              </Card>
            </div>

            {/* Main Sections */}
            <div className="space-y-12">
              {/* Writings Sections */}
              <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <BookOpen className="text-cadet-green" size={20} md:size={24} />
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Bangla Writings</h2>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} md:size={18} />
                    <input 
                      type="text" 
                      placeholder="Search Bangla writings..." 
                      className="w-full pl-9 md:pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-cadet-green text-sm md:text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <WritingList 
                  type="Bangla" 
                  isTeacher={true} 
                  data={data}
                  searchQuery={searchQuery}
                  addWriting={addWriting}
                  setSelectedWriting={setSelectedWriting}
                  deleteWriting={deleteWriting}
                />
              </section>

              <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <FileText className="text-cadet-green" size={20} md:size={24} />
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">English Writings</h2>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} md:size={18} />
                    <input 
                      type="text" 
                      placeholder="Search English writings..." 
                      className="w-full pl-9 md:pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-cadet-green text-sm md:text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <WritingList 
                  type="English" 
                  isTeacher={true} 
                  data={data}
                  searchQuery={searchQuery}
                  addWriting={addWriting}
                  setSelectedWriting={setSelectedWriting}
                  deleteWriting={deleteWriting}
                />
              </section>

              {/* Picture Corner */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="text-cadet-green" />
                  <h2 className="text-3xl font-bold text-slate-800">Picture Corner</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {data.pictureCorner.map((img, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-white"
                    >
                      <img src={img} alt={`Corner ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Acknowledgements & Contributors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><UserCheck className="text-cadet-green" /> Acknowledgements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.officials.filter(o => o.name).map(off => (
                      <div key={off.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                          {off.photoUrl ? <img src={off.photoUrl} alt={off.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <UserCheck className="w-full h-full p-2 text-slate-300" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-cadet-green uppercase">{off.designation}</p>
                          <p className="font-medium text-slate-800">{off.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ContributorsIcon className="text-cadet-green" /> Contributors</h2>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                    {data.contributors.map(c => (
                      <div key={c.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{c.nameBangla} / {c.nameEnglish}</p>
                          <p className="text-sm text-slate-500">{c.role}</p>
                        </div>
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded font-bold uppercase">{c.role}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Comment Section */}
              <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 bg-slate-50 border-r border-slate-100">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><MessageSquare className="text-cadet-green" /> Leave a Comment</h2>
                    <div className="space-y-4">
                      <Select 
                        label="Select Your Role" 
                        value={teacherRole} 
                        onChange={(e: any) => setTeacherRole(e.target.value)}
                        options={[
                          { value: 'Principal', label: 'Principal' },
                          { value: 'Vice Principal', label: 'Vice Principal' },
                          { value: 'Adjutant', label: 'Adjutant' },
                          { value: 'Medical Officer', label: 'Medical Officer' },
                          { value: 'House Master FH', label: 'House Master FH' },
                          { value: 'House Master SH', label: 'House Master SH' },
                          { value: 'House Master NH', label: 'House Master NH' },
                          { value: 'CSC OIC', label: 'CSC OIC' },
                          { value: 'Judge', label: 'Judge' },
                        ]}
                      />
                      {teacherRole === 'Judge' && (
                        <Input label="Judge Name" value={judgeName} onChange={(e: any) => setJudgeName(e.target.value)} placeholder="Enter your name" />
                      )}
                      <TextArea label="Your Comment" value={commentText} onChange={(e: any) => setCommentText(e.target.value)} placeholder="Write your feedback here..." />
                      <Button className="w-full py-4 text-lg" onClick={submitComment}>Submit Feedback</Button>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12">
                    <h2 className="text-2xl font-bold mb-6">Recent Feedback</h2>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                      {data.comments.map(c => (
                        <div key={c.id} className="border-b border-slate-100 pb-6 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-cadet-gold uppercase tracking-widest">{c.role} {c.judgeName ? `- ${c.judgeName}` : ''}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                              <button onClick={() => startEditComment(c)} className="text-slate-300 hover:text-cadet-green"><Edit3 size={14} /></button>
                              <button onClick={() => deleteComment(c.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <p className="text-slate-700 italic leading-relaxed">"{c.text}"</p>
                        </div>
                      ))}
                      {data.comments.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                          No feedback yet. Be the first to comment!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        
        {/* Writing Editor Modal */}
        <AnimatePresence>
          {selectedWriting && (
            <WritingDetail 
              writing={selectedWriting} 
              onClose={() => setSelectedWriting(null)} 
              isTeacher={true}
              handleScore={handleScore}
              updateWriting={updateWriting}
              deleteWriting={deleteWriting}
              handleVote={handleVote}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderMagazineLayout = () => {
    const handlePrint = () => {
      window.focus();
      window.print();
    };

    const banglaWritings = data.writings.filter(w => w.type === 'Bangla');
    const englishWritings = data.writings.filter(w => w.type === 'English');

    return (
      <div className="min-h-screen bg-slate-200 py-6 md:py-12 px-2 md:px-4">
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
          <Button variant="secondary" onClick={() => setView(user?.role === 'cadet' ? 'cadet-dashboard' : 'teacher-dashboard')}>
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => window.open(window.location.href, '_blank')}>
              <ExternalLink size={18} /> Open in New Tab
            </Button>
            {data.mainMagazinePdfUrl && (
              <a href={data.mainMagazinePdfUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Download size={18} /> Download PDF
                </Button>
              </a>
            )}
            <Button variant="primary" onClick={handlePrint}>
              <Download size={18} /> Export as PDF / Print
            </Button>
          </div>
        </div>

        {/* Digital Wall Magazine Board */}
        <div className="bg-white shadow-2xl mx-auto p-4 md:p-12 min-h-screen border-[6px] md:border-[20px] border-cadet-green relative overflow-hidden print:p-8 print:border-0 print:shadow-none w-full max-w-screen-2xl" id="magazine-board">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12 border-b-4 border-cadet-gold pb-6 md:pb-8">
            <h1 className="text-2xl md:text-6xl font-bold text-cadet-green mb-1 md:mb-2">FAZLUL HAQUE HOUSE</h1>
            <h2 className="text-lg md:text-3xl font-serif text-cadet-gold italic">Wall Magazine - 2026</h2>
            <p className="text-[10px] md:text-slate-500 mt-3 md:mt-4 font-bold tracking-[0.1em] md:tracking-[0.3em] uppercase">Mirzapur Cadet College</p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {/* 1. Full Magazine Image */}
            {data.mainMagazineImage && (
              <div className="rounded-xl overflow-hidden shadow-2xl border-4 md:border-8 border-white">
                <img src={data.mainMagazineImage} alt="Main" className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
            )}

            {/* 2. Editorial */}
            <div className="bg-slate-50 p-4 md:p-10 rounded-lg border-2 border-cadet-green/20 relative">
              <h3 className="text-xl md:text-4xl font-bold text-cadet-green mb-4 md:mb-6 border-b-2 border-cadet-gold pb-2 font-serif text-center">সম্পাদকীয়</h3>
              <div className="prose prose-slate font-serif text-xs md:text-base leading-relaxed whitespace-pre-wrap max-w-4xl mx-auto">
                {data.editorial.content || 'Editorial content goes here...'}
              </div>
              <PenTool className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-cadet-green/10 w-8 h-8 md:w-20 md:h-20" />
            </div>

            {/* 3. Contribution and Acknowledgement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-cadet-green text-white p-4 md:p-8 rounded-lg">
                <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 border-b border-white/20 pb-2">Acknowledgements</h3>
                <div className="space-y-3 md:space-y-4">
                  {data.officials.filter(o => o.name).map(off => (
                    <div key={off.id} className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-[8px] md:text-xs font-bold opacity-60 uppercase">{off.designation}</span>
                      <span className="text-xs md:text-base font-medium">{off.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 md:p-8 rounded-lg border-2 border-cadet-gold/20">
                <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 border-b border-cadet-gold pb-2">Contributors</h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {data.contributors.map(c => (
                    <div key={c.id} className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-xs md:text-base">{c.nameBangla}</span>
                      <span className="text-[8px] md:text-xs text-slate-400 uppercase font-bold">{c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Images (Picture Corner) */}
            <div className="bg-slate-50 p-4 md:p-10 rounded-lg border-2 border-cadet-green/20">
              <h3 className="text-xl md:text-3xl font-bold text-cadet-green mb-6 md:mb-8 text-center font-serif">Picture Corner</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {data.pictureCorner.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border-2 md:border-4 border-white shadow-md">
                    <img src={img} alt={`Corner ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. All Comments */}
            <div className="bg-white p-4 md:p-10 rounded-lg border-2 border-slate-100 shadow-sm">
              <h3 className="text-xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8 border-b-2 border-cadet-gold pb-2 font-serif">Recent Feedback</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {data.comments.map(c => (
                  <div key={c.id} className="bg-slate-50 p-3 md:p-4 rounded-lg border-l-4 border-cadet-green">
                    <div className="flex justify-between items-center mb-1 md:mb-2">
                      <span className="text-[8px] md:text-[10px] font-bold text-cadet-gold uppercase tracking-widest">{c.role} {c.judgeName ? `- ${c.judgeName}` : ''}</span>
                      <span className="text-[8px] md:text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-700 italic leading-relaxed">"{c.text}"</p>
                  </div>
                ))}
                {data.comments.length === 0 && (
                  <div className="col-span-full text-center py-6 md:py-8 text-slate-400 text-sm">No feedback yet.</div>
                )}
              </div>
            </div>

            {/* 6. Two columns: Bangla and English writings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Bangla Column */}
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-4xl font-bold text-cadet-green border-b-4 border-cadet-gold pb-2 font-serif text-center">বাংলা সাহিত্য</h3>
                <div className="space-y-6 md:space-y-8">
                  {banglaWritings.map(w => (
                    <div key={w.id} className="bg-white p-4 md:p-8 rounded-lg shadow-md border-t-4 border-cadet-green">
                      <h4 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 font-serif text-slate-800">{w.title}</h4>
                      <p className="text-[10px] md:text-sm text-cadet-gold font-bold mb-3 md:mb-4">By {w.writerName} ({w.cadetNumber})</p>
                      <div className="prose prose-slate font-serif whitespace-pre-wrap text-sm md:text-lg">
                        {w.content}
                      </div>
                    </div>
                  ))}
                  {banglaWritings.length === 0 && <p className="text-center text-slate-400 text-sm">No Bangla writings yet.</p>}
                </div>
              </div>

              {/* English Column */}
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-4xl font-bold text-cadet-green border-b-4 border-cadet-gold pb-2 font-serif text-center">English Literature</h3>
                <div className="space-y-6 md:space-y-8">
                  {englishWritings.map(w => (
                    <div key={w.id} className="bg-white p-4 md:p-8 rounded-lg shadow-md border-t-4 border-cadet-green">
                      <h4 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 font-serif text-slate-800">{w.title}</h4>
                      <p className="text-[10px] md:text-sm text-cadet-gold font-bold mb-3 md:mb-4">By {w.writerName} ({w.cadetNumber})</p>
                      <div className="prose prose-slate font-serif whitespace-pre-wrap text-sm md:text-lg">
                        {w.content}
                      </div>
                    </div>
                  ))}
                  {englishWritings.length === 0 && <p className="text-center text-slate-400 text-sm">No English writings yet.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-4 border-cadet-gold text-center text-slate-400">
            <p className="font-bold tracking-widest uppercase text-xs md:text-sm">Fazlul Haque House &bull; Mirzapur Cadet College &bull; 2026</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {view === 'welcome' && renderWelcome()}
        {view === 'login' && renderLogin()}
        {view === 'cadet-dashboard' && renderCadetDashboard()}
        {view === 'teacher-dashboard' && renderTeacherDashboard()}
        {view === 'magazine-layout' && renderMagazineLayout()}
      </AnimatePresence>
    </div>
  );
}

