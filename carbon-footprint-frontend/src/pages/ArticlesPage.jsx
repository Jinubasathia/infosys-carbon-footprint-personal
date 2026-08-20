import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, ArrowLeft, Search, Calendar, User } from 'lucide-react';

function CoverImage({ src, alt, className }) {
  const [errored, setErrored] = React.useState(false);
  if (!src || errored) {
    return (
      <div className={`bg-gradient-to-br from-emerald-900/40 to-teal-900/40 flex flex-col items-center justify-center gap-2 ${className}`}>
        <BookOpen className="h-10 w-10 text-emerald-700" />
        {errored && <span className="text-xs text-slate-500">Image unavailable</span>}
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setErrored(true)} />;
}

function ArticleCard({ article, onClick }) {
  return (
    <article
      className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800/50 overflow-hidden hover:border-emerald-500/40 transition-all cursor-pointer"
      onClick={() => onClick(article)}
    >
      <CoverImage src={article.coverImage} alt={article.title} className="h-44 w-full" />
      <div className="flex flex-col flex-1 p-5">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{article.category}</span>
        <h2 className="mt-2 font-bold text-white line-clamp-2">{article.title}</h2>
        <p className="mt-2 text-sm text-slate-400 flex-1 line-clamp-3">{article.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">Read Article →</span>
        </div>
      </div>
    </article>
  );
}

function ArticleDetail({ article, onBack }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
        <ArrowLeft className="h-4 w-4" />Back to Articles
      </button>
      <CoverImage src={article.coverImage} alt={article.title} className="w-full rounded-2xl max-h-72" />
      <div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{article.category}</span>
        <h1 className="mt-2 text-2xl font-extrabold text-white">{article.title}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author}</span>
          {article.publishedAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(article.publishedAt).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{article.content}</p>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  useEffect(() => {
    api.get('/articles').then(r => setArticles(r.data || [])).finally(() => setLoading(false));
  }, []);

  // If navigated to /user/articles/:id, load that article
  useEffect(() => {
    if (id) {
      api.get(`/articles/${id}`).then(r => setSelected(r.data)).catch(() => navigate('/user/articles'));
    }
  }, [id]);

  const categories = ['ALL', ...new Set(articles.map(a => a.category).filter(Boolean))];

  const visible = articles.filter(a => {
    const matchSearch = `${a.title} ${a.category} ${a.shortDescription}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'ALL' || a.category === catFilter;
    return matchSearch && matchCat;
  });

  if (selected) {
    return <ArticleDetail article={selected} onBack={() => { setSelected(null); navigate('/user/articles'); }} />;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Articles</h1>
        <p className="text-sm text-slate-400">Sustainability insights and environmental guides.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/50 p-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${catFilter === c ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading articles…</p>
      ) : visible.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map(a => (
            <ArticleCard key={a.id} article={a} onClick={art => { setSelected(art); navigate(`/user/articles/${art.id}`); }} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-12 text-center text-slate-400">
          {search || catFilter !== 'ALL' ? 'No articles match your search.' : 'No published articles available.'}
        </div>
      )}
    </main>
  );
}
