import { useState, useMemo, useCallback, useEffect } from 'react';
import { PLAYERS, TOURNAMENTS, INITIAL_VIDEOS } from './data/database';
import type { Player, Video, Tournament } from './data/database';
import { useAppStore } from './store/useStore';
import {
  listVideos, getVideoStats, addVideo as apiAddVideo,
  saveVideo as apiSaveVideo, unsaveVideo as apiUnsaveVideo,
  listMySavedVideos,
} from './api/videos';
import type { VideoItem as ApiVideoItem } from './api/videos';
import { useAuthStore } from './store/useAuthStore';
import PaywallModal from './components/PaywallModal';
import {
  Search, Trophy, Play, Star, X, ChevronRight, ArrowLeft, Globe,
  BookmarkPlus, Trash2, ExternalLink, TrendingUp,
  Users, DollarSign, Award, Video as VideoIcon, Menu, Crown,
  Calendar, MapPin, Zap, ChevronDown, Medal, User
} from 'lucide-react';
import { I18nProvider, useTranslation } from './i18n/context';

// =================== Icons ===================
function PokerCardIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <path d="M12 6c-2 0-3.5 2-3.5 4s3.5 6 3.5 6 3.5-4 3.5-6-1.5-4-3.5-4z" />
    </svg>
  );
}

// =================== Hero Section ===================
function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1920&q=80&fit=crop"
          alt="Poker tournament"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-triton-black/60 via-triton-black/40 to-triton-black" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-triton-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <PokerCardIcon className="w-10 h-10 text-triton-gold" />
            <span className="text-triton-gold text-sm font-semibold tracking-[0.3em] uppercase">Super High Roller Series</span>
            <PokerCardIcon className="w-10 h-10 text-triton-gold" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gold-shimmer">TRITON POKER</span>
          </h1>
          <p className="text-triton-text-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}

// =================== Stats Bar ===================
function StatsBar() {
  const { t } = useTranslation();
  const stats = [
    { icon: Trophy, label: t('stats.events'), value: '20+' },
    { icon: Users, label: t('stats.players'), value: '1000+' },
    { icon: DollarSign, label: t('stats.prizePool'), value: '$1B+' },
    { icon: Award, label: t('stats.yearly'), value: '2016-至今' },
  ];
  return (
    <div className="border-y border-triton-border bg-triton-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="p-2 bg-triton-gold/10 rounded-lg">
              <Icon className="w-5 h-5 text-triton-gold" />
            </div>
            <div>
              <div className="text-xl font-bold text-triton-text">{value}</div>
              <div className="text-xs text-triton-text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== Player Card ===================
function PlayerCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className="group bg-triton-card border border-triton-border rounded-xl overflow-hidden cursor-pointer hover:border-triton-gold/40 transition-all duration-300 animate-fadeIn"
    >
      <div className="relative h-32 bg-gradient-to-br from-triton-gold/10 to-triton-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,168,78,0.15),transparent)]" />
        {player.titles >= 5 && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-triton-gold text-triton-black text-xs font-bold rounded-full flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {t('player.titles', { n: player.titles })}
          </div>
        )}
      </div>
      <div className="relative -mt-10 z-10">
        <img
          src={player.image}
          alt={player.name}
          className="mx-auto w-20 h-20 rounded-full border-4 border-triton-card object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="pt-2 pb-5 px-5 text-center">
        <h3 className="text-lg font-bold text-triton-text group-hover:text-triton-gold transition-colors">{player.name}</h3>
        <p className="text-triton-text-muted text-sm mt-1">{player.flag} {player.country}</p>
        {player.nickname && (
          <p className="text-triton-gold/60 text-xs mt-1 italic">&quot;{player.nickname}&quot;</p>
        )}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="text-center">
            <div className="text-triton-gold font-bold text-lg">{player.titles}</div>
            <div className="text-triton-text-muted">{t('player.champion')}</div>
          </div>
          <div className="w-px bg-triton-border" />
          <div className="text-center">
            <div className="text-triton-text font-bold text-lg">{player.cashes}</div>
            <div className="text-triton-text-muted">{t('player.cashes')}</div>
          </div>
          <div className="w-px bg-triton-border" />
          <div className="text-center">
            <div className="text-triton-green font-bold text-lg">{player.totalEarnings}</div>
            <div className="text-triton-text-muted">{t('player.totalEarnings')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== Player Detail ===================
function PlayerDetail({ player, onBack, onSearchVideos }: { player: Player; onBack: () => void; onSearchVideos: (q: string) => void }) {
  const { t } = useTranslation();
  const sortedResults = [...player.tritonResults].sort((a, b) => b.year - a.year || a.buyIn.localeCompare(b.buyIn));
  const totalPrize = player.tritonResults.reduce((sum, r) => {
    const num = parseFloat(r.prize.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-triton-text-muted hover:text-triton-gold transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{t('player.back')}</span>
      </button>

      {/* Header */}
      <div className="relative bg-triton-card border border-triton-border rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-triton-gold/5 via-transparent to-triton-gold/5" />
        <div className="relative p-8 flex flex-col md:flex-row items-center md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-triton-gold to-triton-gold-dark">
              <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover border-2 border-triton-card" />
            </div>
            {player.titles > 0 && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-triton-gold rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-triton-black" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left md:-mt-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold text-triton-text">{player.name}</h1>
              <span className="text-2xl">{player.flag}</span>
            </div>
            <p className="text-triton-text-muted mt-1">{player.country}{player.nickname ? ` · "${player.nickname}"` : ''}</p>
            <p className="text-triton-text-muted/80 mt-3 max-w-2xl text-sm leading-relaxed">{player.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {player.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs bg-triton-gold/10 text-triton-gold rounded-full border border-triton-gold/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 min-w-[280px]">
            {[
              { label: t('player.totalEarnings'), value: player.totalEarnings, color: 'text-triton-green' },
              { label: t('player.champion'), value: `${player.titles}`, color: 'text-triton-gold' },
              { label: t('player.bestCash'), value: player.bestCash, color: 'text-triton-blue' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-3 bg-triton-black/30 rounded-lg">
                <div className={`text-lg font-bold ${color}`}>{value}</div>
                <div className="text-xs text-triton-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => onSearchVideos(player.name)}
          className="flex items-center gap-2 px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-triton-text-muted hover:text-triton-gold hover:border-triton-gold/30 transition-all"
        >
          <VideoIcon className="w-4 h-4" />
          {t('player.searchVideos')}
        </button>
        {player.otherSeries?.map((s) => (
          <span key={s} className="px-3 py-2 text-xs bg-triton-card border border-triton-border rounded-lg text-triton-text-muted">
            {s}
          </span>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-triton-card border border-triton-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-triton-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-triton-text">{t('player.tritonResults')}</h2>
          <span className="text-sm text-triton-text-muted">
            {t('player.tritonTotal')}: <span className="text-triton-green font-bold">${totalPrize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-triton-text-muted border-b border-triton-border">
                <th className="text-left px-6 py-3 font-medium">{t('player.year')}</th>
                <th className="text-left px-6 py-3 font-medium">{t('player.location')}</th>
                <th className="text-left px-6 py-3 font-medium">{t('player.event')}</th>
                <th className="text-right px-6 py-3 font-medium">{t('player.buyIn')}</th>
                <th className="text-right px-6 py-3 font-medium">{t('player.prize')}</th>
                <th className="text-center px-6 py-3 font-medium">{t('player.placing')}</th>
                <th className="text-right px-6 py-3 font-medium">{t('player.entries')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((r, i) => (
                <tr key={i} className="border-b border-triton-border/50 hover:bg-triton-card-hover transition-colors">
                  <td className="px-6 py-3 text-sm text-triton-text">{r.year}</td>
                  <td className="px-6 py-3 text-sm text-triton-text-muted">{r.location}</td>
                  <td className="px-6 py-3 text-sm text-triton-text font-medium">{r.eventName}</td>
                  <td className="px-6 py-3 text-sm text-triton-text-muted text-right">{r.buyIn}</td>
                  <td className={`px-6 py-3 text-sm text-right font-semibold ${r.placing === '1st' ? 'text-triton-green' : 'text-triton-text'}`}>
                    {r.prize}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      r.placing === '1st' ? 'bg-triton-gold text-triton-black' :
                      r.placing === '2nd' ? 'bg-gray-300/20 text-gray-300' :
                      r.placing === '3rd' ? 'bg-amber-800/30 text-amber-600' :
                      'bg-triton-border text-triton-text-muted'
                    }`}>
                      {r.placing}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-triton-text-muted text-right">{r.players}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =================== Video Card ===================
function VideoCard({ video, onSave, onRemove, isLibrary = false }: {
  video: Video;
  onSave?: (v: Video) => void;
  onRemove?: (id: string) => void;
  isLibrary?: boolean;
}) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const platformColors: Record<string, string> = {
    youtube: 'bg-red-600',
    twitch: 'bg-purple-600',
    pokertube: 'bg-blue-600',
    other: 'bg-gray-600',
  };

  const youtubeId = video.url.includes('youtube.com/watch?v=')
    ? video.url.split('v=')[1]?.split('&')[0]
    : video.url.includes('youtu.be/')
    ? video.url.split('youtu.be/')[1]?.split('?')[0]
    : null;

  return (
    <div className="group bg-triton-card border border-triton-border rounded-xl overflow-hidden hover:border-triton-gold/30 transition-all duration-300 animate-fadeIn">
      <div className="relative aspect-video bg-triton-black overflow-hidden">
        {isPlaying && youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Play button overlay */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-14 h-14 bg-triton-gold/90 rounded-full flex items-center justify-center hover:bg-triton-gold hover:scale-110 transition-all shadow-lg shadow-triton-gold/20">
                <Play className="w-6 h-6 text-triton-black ml-1" fill="currentColor" />
              </div>
            </button>
            <div className="absolute top-3 left-3 flex gap-2 z-20">
              <span className={`px-2 py-0.5 ${platformColors[video.platform]} text-white text-xs font-bold rounded`}>
                {video.platform.toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
              {video.duration}
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/70 text-xs">
              <Play className="w-3 h-3" />
              <span>{video.views} views</span>
            </div>
            {isLibrary && video.isSaved && (
              <div className="absolute top-3 right-3 p-1 bg-triton-gold rounded-full z-20">
                <Star className="w-3 h-3 text-triton-black fill-triton-black" />
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-triton-text line-clamp-2 group-hover:text-triton-gold transition-colors">
          {video.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {video.players.slice(0, 3).map((p) => (
            <span key={p} className="px-2 py-0.5 text-xs bg-triton-gold/10 text-triton-gold/70 rounded">
              {p}
            </span>
          ))}
          {video.tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs bg-triton-border text-triton-text-muted rounded">
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-triton-border/50">
          <span className="text-xs text-triton-text-muted">
            {video.event} · {video.publishedAt}
          </span>
          <div className="flex gap-1">
            {!isLibrary && onSave && (
              <button
                onClick={() => onSave(video)}
                className="p-1.5 hover:bg-triton-gold/10 rounded transition-colors"
                title={t('video.addToLibraryShort')}
              >
                <BookmarkPlus className="w-4 h-4 text-triton-text-muted hover:text-triton-gold" />
              </button>
            )}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-triton-gold/10 rounded transition-colors"
              title={t('video.openOnYoutube')}
            >
              <ExternalLink className="w-4 h-4 text-triton-text-muted hover:text-triton-gold" />
            </a>
            {isLibrary && onRemove && (
              <button
                onClick={() => onRemove(video.id)}
                className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                title={t('video.removeFromLibrary')}
              >
                <Trash2 className="w-4 h-4 text-triton-text-muted hover:text-triton-red" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== Tournament Card ===================
function TournamentCard({ tournament, onClick }: { tournament: typeof TOURNAMENTS[0]; onClick?: () => void }) {
  const { t } = useTranslation();
  const isUpcoming = new Date(tournament.startDate) > new Date();
  return (
    <div
      onClick={onClick}
      className={`group bg-triton-card border border-triton-border rounded-xl overflow-hidden hover:border-triton-gold/40 transition-all duration-300 animate-fadeIn ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative h-40 overflow-hidden">
        <img src={tournament.imageUrl} alt={tournament.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-triton-card via-triton-card/30 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-triton-gold/90 text-triton-black text-xs font-bold rounded">{tournament.year}</span>
          {isUpcoming && (
            <span className="ml-2 px-2 py-1 bg-triton-green/90 text-triton-black text-xs font-bold rounded animate-pulse">{t('tournament.upcoming')}</span>
          )}
        </div>
        {onClick && (
          <div className="absolute bottom-3 right-3 p-1.5 bg-triton-gold/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-triton-black" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-triton-text group-hover:text-triton-gold transition-colors">{tournament.name}</h3>
        <p className="text-triton-text-muted text-sm mt-1 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> {tournament.location}
        </p>
        <p className="text-triton-text-muted/70 text-xs mt-2 line-clamp-2">{tournament.description}</p>
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1 text-triton-text-muted">
            <Trophy className="w-3.5 h-3.5 text-triton-gold" />
            <span>{tournament.winner}</span>
          </div>
          <div className="flex items-center gap-1 text-triton-text-muted">
            <DollarSign className="w-3.5 h-3.5 text-triton-green" />
            <span>{tournament.totalPrizePool}</span>
          </div>
          <div className="flex items-center gap-1 text-triton-text-muted">
            <Users className="w-3.5 h-3.5" />
            <span>{tournament.events} {t('tournament.events')}</span>
          </div>
        </div>
        <div className="mt-3 px-2 py-1.5 bg-triton-black/30 rounded text-xs text-triton-text-muted">
          {tournament.startDate} ~ {tournament.endDate}
        </div>
      </div>
    </div>
  );
}

// =================== Tournament Detail ===================
function TournamentDetail({ tournament, onBack, onSelectPlayer }: {
  tournament: Tournament;
  onBack: () => void;
  onSelectPlayer: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const isUpcoming = new Date(tournament.startDate) > new Date();
  const completedEvents = tournament.eventList?.filter(e => e.status === 'completed') || [];
  const upcomingEvents = tournament.eventList?.filter(e => e.status === 'upcoming') || [];

  // Collect all unique players from this tournament
  const allPlayers = useMemo(() => {
    const playerMap = new Map<string, { name: string; id?: string; country?: string; flag?: string; gpiRanking?: number; totalPrize: number; results: number }>();
    tournament.eventList?.forEach(event => {
      event.results.forEach(r => {
        const existing = playerMap.get(r.playerName);
        const prize = parseFloat(r.prize.replace(/[^0-9.]/g, '')) || 0;
        if (existing) {
          existing.totalPrize += prize;
          existing.results += 1;
          if (r.gpiRanking && (!existing.gpiRanking || r.gpiRanking < existing.gpiRanking)) {
            existing.gpiRanking = r.gpiRanking;
          }
          if (r.playerId && !existing.id) existing.id = r.playerId;
          if (r.country && !existing.country) { existing.country = r.country; existing.flag = r.flag; }
        } else {
          playerMap.set(r.playerName, {
            name: r.playerName,
            id: r.playerId,
            country: r.country,
            flag: r.flag,
            gpiRanking: r.gpiRanking,
            totalPrize: prize,
            results: 1,
          });
        }
      });
    });
    return Array.from(playerMap.values()).sort((a, b) => b.totalPrize - a.totalPrize);
  }, [tournament.eventList]);

  const placingColors: Record<string, string> = {
    '1st': 'bg-triton-gold text-triton-black',
    '2nd': 'bg-gray-400/20 text-gray-300',
    '3rd': 'bg-amber-700/30 text-amber-500',
  };

  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-triton-text-muted hover:text-triton-gold transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{t('player.back')}</span>
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-56 md:h-72">
        <img
          src={tournament.imageUrl}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-triton-black via-triton-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-triton-gold/90 text-triton-black text-sm font-bold rounded">{tournament.year}</span>
            {isUpcoming ? (
              <span className="px-3 py-1 bg-triton-green/90 text-triton-black text-sm font-bold rounded animate-pulse flex items-center gap-1">
                <Zap className="w-3 h-3" /> {t('tournament.upcoming')}
              </span>
            ) : (
              <span className="px-3 py-1 bg-triton-blue/80 text-white text-sm font-bold rounded flex items-center gap-1">
                <Trophy className="w-3 h-3" /> {t('tournament.ended')}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-triton-text">{tournament.name}</h1>
          <p className="text-triton-text-muted text-sm md:text-base mt-2">{tournament.description}</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Calendar, label: t('tournament.date'), value: `${tournament.startDate} ~ ${tournament.endDate}` },
          { icon: MapPin, label: t('tournament.location'), value: tournament.location },
          { icon: DollarSign, label: t('tournament.totalPrizePool'), value: tournament.totalPrizePool, color: 'text-triton-green' },
          { icon: Trophy, label: t('tournament.champion'), value: tournament.winner, color: 'text-triton-gold' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-triton-card border border-triton-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-triton-gold" />
              <span className="text-xs text-triton-text-muted">{label}</span>
            </div>
            <div className={`text-sm font-bold ${color || 'text-triton-text'} truncate`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      {tournament.highlights && (
        <div className="bg-gradient-to-r from-triton-gold/5 via-triton-card to-triton-gold/5 border border-triton-gold/20 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-triton-gold" />
            <h3 className="text-sm font-bold text-triton-gold">{t('tournament.highlights')}</h3>
          </div>
          <p className="text-triton-text-muted text-sm leading-relaxed">{tournament.highlights}</p>
        </div>
      )}

      {/* Venue & GPI Info */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tournament.venue && (
          <div className="flex items-center gap-2 px-4 py-2 bg-triton-card border border-triton-border rounded-lg text-sm">
            <MapPin className="w-4 h-4 text-triton-text-muted" />
            <span className="text-triton-text">{tournament.venue}</span>
          </div>
        )}
        {tournament.gpiNote && (
          <div className="flex items-center gap-2 px-4 py-2 bg-triton-card border border-triton-border rounded-lg text-sm">
            <TrendingUp className="w-4 h-4 text-triton-blue" />
            <span className="text-triton-text-muted">{tournament.gpiNote}</span>
          </div>
        )}
      </div>

      {/* Event List */}
      {tournament.eventList && tournament.eventList.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-triton-gold" />
            <h2 className="text-xl font-bold text-triton-text">
              {t('tournament.eventList')}
            </h2>
            <span className="text-sm text-triton-text-muted">({tournament.eventList.length} 场)</span>
          </div>

          {/* Completed Events */}
          {completedEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-triton-green mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-triton-green rounded-full" />
                {t('tournament.completed')} ({completedEvents.length})
              </h3>
              <div className="space-y-3">
                {completedEvents.map(event => (
                  <div key={event.id} className="bg-triton-card border border-triton-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-triton-card-hover transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-triton-text">{event.name}</span>
                          <span className="px-2 py-0.5 bg-triton-blue/10 text-triton-blue text-xs rounded border border-triton-blue/20">{event.gameType}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-triton-text-muted">
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {event.buyIn}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.entries} {t('tournament.entriesUnit')}</span>
                          <span className="text-triton-green font-semibold">{event.prizePool}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5">
                          <Medal className="w-4 h-4 text-triton-gold" />
                          <span className="text-sm font-bold text-triton-gold">{event.results[0]?.playerName}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-triton-text-muted transition-transform ${expandedEvent === event.id ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {expandedEvent === event.id && event.results.length > 0 && (
                      <div className="border-t border-triton-border">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-xs text-triton-text-muted border-b border-triton-border/50">
                                <th className="text-left px-4 py-2.5 font-medium w-16">{t('tournament.placing')}</th>
                                <th className="text-left px-4 py-2.5 font-medium">{t('tournament.player')}</th>
                                <th className="text-center px-4 py-2.5 font-medium w-20">{t('tournament.gpiRanking')}</th>
                                <th className="text-right px-4 py-2.5 font-medium">{t('tournament.prize')}</th>
                                {event.results[0]?.playerId && <th className="px-4 py-2.5 w-16"></th>}
                              </tr>
                            </thead>
                            <tbody>
                              {event.results.map((r, i) => (
                                <tr key={i} className="border-b border-triton-border/30 hover:bg-triton-card-hover transition-colors">
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${placingColors[r.placing] || 'bg-triton-border text-triton-text-muted'}`}>
                                      {r.placing}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {r.flag && <span className="text-sm">{r.flag}</span>}
                                      <span className={`text-sm font-medium ${r.playerId ? 'text-triton-text hover:text-triton-gold' : 'text-triton-text'}`}>
                                        {r.playerName}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {r.gpiRanking ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-triton-blue/10 text-triton-blue text-xs rounded border border-triton-blue/20">
                                        <TrendingUp className="w-3 h-3" /> #{r.gpiRanking}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-triton-text-muted">-</span>
                                    )}
                                  </td>
                                  <td className={`px-4 py-3 text-sm text-right font-semibold ${r.placing === '1st' ? 'text-triton-green' : 'text-triton-text'}`}>
                                    {r.prize}
                                  </td>
                                  {event.results[0]?.playerId && (
                                    <td className="px-4 py-3">
                                      {r.playerId && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); onSelectPlayer(r.playerId!); }}
                                          className="text-xs text-triton-gold hover:underline flex items-center gap-1"
                                        >
                                          <User className="w-3 h-3" /> {t('tournament.detail')}
                                        </button>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-triton-gold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-triton-gold rounded-full animate-pulse" />
                {t('tournament.upcoming')} ({upcomingEvents.length})
              </h3>
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-triton-card border border-triton-border/50 border-dashed rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-triton-text">{event.name}</span>
                        <span className="px-2 py-0.5 bg-triton-gold/10 text-triton-gold text-xs rounded">{event.gameType}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-triton-text-muted">
                        <span>{event.buyIn}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-triton-gold/10 text-triton-gold text-xs font-bold rounded animate-pulse">{t('tournament.pending')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Player Leaderboard */}
      {allPlayers.length > 0 && (
        <div className="bg-triton-card border border-triton-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-triton-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-triton-text flex items-center gap-2">
              <Users className="w-5 h-5 text-triton-gold" />
              {t('tournament.leaderboard')}
            </h2>
            <span className="text-sm text-triton-text-muted">{t('tournament.totalPlayers', { n: allPlayers.length })}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-triton-text-muted border-b border-triton-border">
                  <th className="text-left px-6 py-3 font-medium w-16">#</th>
                  <th className="text-left px-6 py-3 font-medium">{t('tournament.player')}</th>
                  <th className="text-center px-6 py-3 font-medium">{t('tournament.gpiRanking')}</th>
                  <th className="text-center px-6 py-3 font-medium">{t('tournament.appearances')}</th>
                  <th className="text-right px-6 py-3 font-medium">{t('tournament.localPrize')}</th>
                  <th className="px-6 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {allPlayers.map((p, i) => (
                  <tr key={p.name} className="border-b border-triton-border/50 hover:bg-triton-card-hover transition-colors">
                    <td className="px-6 py-3">
                      {i < 3 ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? 'bg-triton-gold text-triton-black' : i === 1 ? 'bg-gray-400/30 text-gray-300' : 'bg-amber-700/30 text-amber-500'}`}>
                          {i + 1}
                        </span>
                      ) : (
                        <span className="text-sm text-triton-text-muted">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {p.flag && <span>{p.flag}</span>}
                        <span className={`text-sm font-medium ${p.id ? 'text-triton-text cursor-pointer hover:text-triton-gold' : 'text-triton-text'}`}>
                          {p.name}
                        </span>
                        {p.country && (
                          <span className="text-xs text-triton-text-muted hidden sm:inline">{p.country}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {p.gpiRanking ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-triton-blue/10 text-triton-blue text-xs rounded border border-triton-blue/20">
                          <TrendingUp className="w-3 h-3" /> #{p.gpiRanking}
                        </span>
                      ) : (
                        <span className="text-xs text-triton-text-muted">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-triton-text-muted">{p.results}</td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-triton-green">
                      ${p.totalPrize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-3">
                      {p.id && (
                        <button
                          onClick={() => onSelectPlayer(p.id!)}
                          className="text-xs text-triton-gold hover:underline flex items-center gap-1"
                        >
                          <User className="w-3 h-3" /> {t('tournament.detail')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
function SearchResults({ query, onSelectPlayer, onSelectTournament, onSearchVideos }: {
  query: string;
  onSelectPlayer: (id: string) => void;
  onSelectTournament: (id: string) => void;
  onSearchVideos: (q: string) => void;
}) {
  const { t } = useTranslation();
  const q = query.toLowerCase();
  const matchedPlayers = PLAYERS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.country.toLowerCase().includes(q) ||
    p.nickname?.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
  const matchedVideos = INITIAL_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(q) ||
    v.event?.toLowerCase().includes(q) ||
    v.players.some(p => p.toLowerCase().includes(q)) ||
    v.tags.some(t => t.toLowerCase().includes(q)) ||
    v.subtitles?.toLowerCase().includes(q)
  );
  const matchedTournaments = TOURNAMENTS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.location.toLowerCase().includes(q) ||
    t.winner.toLowerCase().includes(q)
  );

  const hasResults = matchedPlayers.length > 0 || matchedVideos.length > 0 || matchedTournaments.length > 0;

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-triton-gold" />
        <h2 className="text-xl font-bold text-triton-text">
          {t('search.title')}: &quot;{query}&quot;
        </h2>
        <span className="text-sm text-triton-text-muted">
          ({matchedPlayers.length} {t('search.players')} · {matchedVideos.length} {t('search.videos')} · {matchedTournaments.length} {t('search.tournaments')})
        </span>
      </div>

      {!hasResults && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-triton-text-muted/30 mx-auto mb-4" />
          <p className="text-triton-text-muted text-lg">{t('search.noResults')}</p>
          <p className="text-triton-text-muted/50 text-sm mt-2">{t('search.tryOther')}</p>
        </div>
      )}

      {matchedPlayers.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-triton-gold" />
            <h3 className="text-lg font-semibold text-triton-text">{t('search.players')} ({matchedPlayers.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchedPlayers.map(p => (
              <PlayerCard key={p.id} player={p} onClick={() => onSelectPlayer(p.id)} />
            ))}
          </div>
        </section>
      )}

      {matchedVideos.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-triton-gold" />
              <h3 className="text-lg font-semibold text-triton-text">{t('search.relatedVideos')} ({matchedVideos.length})</h3>
            </div>
            <button
              onClick={() => onSearchVideos(query)}
              className="text-sm text-triton-gold hover:underline flex items-center gap-1"
            >
              {t('search.searchMoreVideos')} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchedVideos.map(v => (
              <VideoCard key={v.id} video={v} isLibrary={true} />
            ))}
          </div>
        </section>
      )}

      {matchedTournaments.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-triton-gold" />
            <h3 className="text-lg font-semibold text-triton-text">{t('search.tournaments')} ({matchedTournaments.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedTournaments.map(t => (
              <TournamentCard key={t.id} tournament={t} onClick={() => onSelectTournament(t.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// =================== Video Library ===================
function VideoLibrary({ initialSearch }: { initialSearch?: string }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views'>('newest');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterSaved, setFilterSaved] = useState<boolean>(false);
  const [searchScope, setSearchScope] = useState<'all' | 'player' | 'event' | 'hand' | 'subtitle' | 'tag'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '', url: '', event: '', players: '', tags: '', subtitles: ''
  });
  const [videos, setVideos] = useState<ApiVideoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<number, string | null>>({}); // videoId -> 'saving'|'unsaving'
  const [stats, setStats] = useState<{ total_videos: number; total_views: string } | null>(null);
  const [addingVideo, setAddingVideo] = useState(false);
  const pageSize = 20;

  const { isAuthenticated, isPremium } = useAuthStore();

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 加载视频列表
  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listVideos({
        page: filterSaved ? undefined : page,
        page_size: pageSize,
        search: debouncedSearch || undefined,
        search_scope: searchScope,
        platform: filterPlatform !== 'all' ? filterPlatform : undefined,
        sort_by: sortBy,
      });

      if (filterSaved && isPremium) {
        // 收藏模式：使用收藏 API
        const savedRes = await listMySavedVideos({ page, page_size: pageSize });
        setVideos(savedRes.saved_videos.map(sv => ({
          id: sv.video_id,
          title: sv.title,
          url: sv.url,
          thumbnail: sv.thumbnail,
          platform: sv.platform,
          duration: sv.duration,
          views: null,
          published_at: null,
          event: sv.event,
          players: sv.players,
          player_ids: [],
          subtitles: null,
          tags: sv.tags,
          description: null,
          source_type: 'embed',
          is_saved: true,
          saved_at: sv.saved_at,
          save_count: 0,
        })));
        setTotal(savedRes.total);
      } else {
        setVideos(res.videos);
        setTotal(res.total);
      }
    } catch {
      // API 不可用时 fallback 到本地数据
      const localVideos = useAppStore.getState().savedVideos;
      setVideos(localVideos.map(v => ({
        id: typeof v.id === 'string' ? parseInt(v.id.replace(/\D/g, '')) || 0 : v.id,
        title: v.title,
        url: isPremium ? v.url : null,
        thumbnail: v.thumbnail,
        platform: v.platform,
        duration: v.duration,
        views: v.views,
        published_at: v.publishedAt,
        event: v.event ?? null,
        players: v.players,
        tags: v.tags,
        subtitles: v.subtitles,
        is_saved: v.isSaved,
      })));
      setTotal(localVideos.length);
    }
    setLoading(false);
  }, [debouncedSearch, searchScope, filterPlatform, sortBy, filterSaved, page, isPremium]);

  // 加载统计
  useEffect(() => {
    getVideoStats().then(setStats).catch(() => {});
  }, []);

  // 搜索/过滤变化时重新加载
  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // 切换收藏
  const handleToggleSave = async (videoId: number, currentlySaved: boolean) => {
    if (!isPremium) return;
    const key = videoId;
    setSaving(s => ({ ...s, [key]: currentlySaved ? 'unsaving' : 'saving' }));
    try {
      if (currentlySaved) {
        await apiUnsaveVideo(videoId);
      } else {
        await apiSaveVideo(videoId);
      }
      // 更新本地列表中的收藏状态
      setVideos(prev => prev.map(v =>
        v.id === videoId ? { ...v, is_saved: !currentlySaved } : v
      ));
    } catch {
      // ignore
    }
    setSaving(s => {
      const next = { ...s };
      delete next[key];
      return next;
    });
  };

  // 添加视频
  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.url) return;
    setAddingVideo(true);
    try {
      await apiAddVideo({
        title: newVideo.title,
        url: newVideo.url,
        event: newVideo.event || undefined,
        players: newVideo.players.split(',').map(s => s.trim()).filter(Boolean),
        tags: newVideo.tags.split(',').map(s => s.trim()).filter(Boolean),
        subtitles: newVideo.subtitles || undefined,
      });
      setShowAddModal(false);
      setNewVideo({ title: '', url: '', event: '', players: '', tags: '', subtitles: '' });
      loadVideos(); // 刷新列表
    } catch {
      // fallback: 存到本地 store
      const store = useAppStore.getState();
      store.addVideo({
        id: `custom-${Date.now()}`,
        title: newVideo.title,
        url: newVideo.url,
        thumbnail: newVideo.url.includes('youtube.com/watch?v=')
          ? `https://img.youtube.com/vi/${newVideo.url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`
          : newVideo.url.includes('youtu.be/')
          ? `https://img.youtube.com/vi/${newVideo.url.split('youtu.be/')[1]?.split('?')[0]}/maxresdefault.jpg`
          : 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=320&h=180&fit=crop',
        platform: newVideo.url.includes('youtube') ? 'youtube' : newVideo.url.includes('twitch') ? 'twitch' : 'other',
        duration: '--:--',
        views: '0',
        publishedAt: new Date().toISOString().split('T')[0],
        event: newVideo.event || undefined,
        players: newVideo.players.split(',').map(s => s.trim()).filter(Boolean),
        subtitles: newVideo.subtitles,
        tags: newVideo.tags.split(',').map(s => s.trim()).filter(Boolean),
        addedAt: new Date().toISOString().split('T')[0],
        isSaved: true,
      });
      setShowAddModal(false);
      setNewVideo({ title: '', url: '', event: '', players: '', tags: '', subtitles: '' });
      loadVideos();
    }
    setAddingVideo(false);
  };

  // 加载更多
  const hasMore = page * pageSize < total;

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-triton-text flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-triton-gold" />
            {t('video.library')}
          </h2>
          <p className="text-triton-text-muted text-sm mt-1">
            {stats ? `${t('video.totalVideos', { n: stats.total_videos })} · ${stats.total_views} ${t('video.totalViews')}` : t('video.totalVideos', { n: total })}
            {!isPremium && <span className="text-triton-gold ml-2">{t('video.loginForMore')}</span>}
          </p>
        </div>
        {isPremium && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-triton-gold-dark to-triton-gold text-triton-black font-semibold rounded-lg hover:from-triton-gold hover:to-triton-gold-light transition-all self-start"
          >
            <BookmarkPlus className="w-4 h-4" />
            {t('video.addVideo')}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        {/* 搜索范围 Tab */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {([
            { key: 'all', label: t('video.searchScope.all'), icon: '🔍' },
            { key: 'player', label: t('video.searchScope.player'), icon: '👤' },
            { key: 'event', label: t('video.searchScope.event'), icon: '🏆' },
            { key: 'hand', label: t('video.searchScope.hand'), icon: '🃏' },
            { key: 'subtitle', label: t('video.searchScope.subtitle'), icon: '📝' },
            { key: 'tag', label: t('video.searchScope.tag'), icon: '🏷' },
          ] as const).map(item => (
            <button
              key={item.key}
              onClick={() => { setSearchScope(item.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                searchScope === item.key
                  ? 'bg-triton-gold/15 text-triton-gold border border-triton-gold/30'
                  : 'bg-triton-card border border-triton-border text-triton-text-muted hover:text-triton-text hover:border-triton-text-muted/30'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* 搜索栏 + 过滤 */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-triton-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchScope === 'all' ? t('video.searchPlaceholder.all')
                : searchScope === 'player' ? t('video.searchPlaceholder.player')
                : searchScope === 'event' ? t('video.searchPlaceholder.event')
                : searchScope === 'hand' ? t('video.searchPlaceholder.hand')
                : searchScope === 'subtitle' ? t('video.searchPlaceholder.subtitle')
                : t('video.searchPlaceholder.tag')
              }
              className="w-full pl-10 pr-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-triton-text-muted hover:text-triton-text" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text outline-none appearance-none cursor-pointer"
            >
              <option value="newest">{t('video.sort.newest')}</option>
              <option value="oldest">{t('video.sort.oldest')}</option>
              <option value="views">{t('video.sort.views')}</option>
            </select>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text outline-none appearance-none cursor-pointer"
            >
              <option value="all">{t('video.allPlatforms')}</option>
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
              <option value="pokertube">PokerTube</option>
            </select>
            {isPremium && (
              <button
                onClick={() => { setFilterSaved(!filterSaved); setPage(1); }}
                className={`px-3 py-2.5 rounded-lg text-sm border transition-all ${
                  filterSaved
                    ? 'bg-triton-gold/10 border-triton-gold/30 text-triton-gold'
                    : 'bg-triton-card border-triton-border text-triton-text-muted hover:text-triton-text'
                }`}
                title={t('video.savedOnly')}
              >
                <Star className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {loading && videos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-triton-gold/30 border-t-triton-gold rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <VideoIcon className="w-12 h-12 text-triton-text-muted/30 mx-auto mb-4" />
          <p className="text-triton-text-muted">{t('video.noVideos')}</p>
          <p className="text-triton-text-muted/50 text-sm mt-2">
            {debouncedSearch ? t('video.noMatch') : t('video.noVideosHint')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map(v => (
              <VideoCardApi
                key={v.id}
                video={v}
                isPremium={isPremium}
                savingState={saving[v.id] || null}
                onSave={isPremium ? () => handleToggleSave(v.id, !!v.is_saved) : undefined}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2.5 border border-triton-border text-triton-text-muted rounded-lg hover:border-triton-gold/30 hover:text-triton-gold transition-all text-sm"
              >
                {t('video.loadMore')} ({page * pageSize} / {total})
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-triton-dark border border-triton-border rounded-2xl w-full max-w-lg p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-triton-text">{t('video.addToLibrary')}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/5 rounded">
                <X className="w-5 h-5 text-triton-text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-triton-text-muted mb-1">{t('video.formTitle')}</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="例: Triton London 2023 Final Table"
                  className="w-full px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm text-triton-text-muted mb-1">{t('video.formUrl')}</label>
                <input
                  type="url"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-triton-text-muted mb-1">{t('video.formEvent')}</label>
                  <input
                    type="text"
                    value={newVideo.event}
                    onChange={(e) => setNewVideo({ ...newVideo, event: e.target.value })}
                    placeholder="Triton London 2023"
                    className="w-full px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-triton-text-muted mb-1">参赛牌手</label>
                  <input
                    type="text"
                    value={newVideo.players}
                    onChange={(e) => setNewVideo({ ...newVideo, players: e.target.value })}
                    placeholder="Jason Koon, Phil Ivey"
                    className="w-full px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-triton-text-muted mb-1">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={newVideo.tags}
                  onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
                  placeholder="Final Table, NL Hold'em, Highlights"
                  className="w-full px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm text-triton-text-muted mb-1">字幕/手牌内容（用于搜索）</label>
                <textarea
                  value={newVideo.subtitles}
                  onChange={(e) => setNewVideo({ ...newVideo, subtitles: e.target.value })}
                  placeholder="输入字幕内容、手牌分析关键词，如：&#10;final table, all-in, river, bluff&#10;AA vs KK preflop all-in&#10;amazing bluff with 72o..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50 resize-none"
                />
              </div>
              <button
                onClick={handleAddVideo}
                disabled={!newVideo.title || !newVideo.url || addingVideo}
                className="w-full py-3 bg-gradient-to-r from-triton-gold-dark to-triton-gold text-triton-black font-bold rounded-lg hover:from-triton-gold hover:to-triton-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {addingVideo ? '提交中...' : '添加到视频库'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =================== Video Card (API 版本) ===================
function VideoCardApi({ video, isPremium, savingState, onSave }: {
  video: ApiVideoItem;
  isPremium: boolean;
  savingState: string | null;
  onSave?: () => void;
}) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const platformColors: Record<string, string> = {
    youtube: 'bg-red-600',
    twitch: 'bg-purple-600',
    pokertube: 'bg-blue-600',
    other: 'bg-gray-600',
    cos: 'bg-teal-600',
  };

  const youtubeId = video.url ? (
    video.url.includes('youtube.com/watch?v=')
      ? video.url.split('v=')[1]?.split('&')[0]
      : video.url.includes('youtu.be/')
      ? video.url.split('youtu.be/')[1]?.split('?')[0]
      : video.url.includes('youtube.com/embed/')
      ? video.url.split('embed/')[1]?.split('?')[0]
      : null
  ) : null;

  const canPlay = isPremium && video.url;

  return (
    <div className="group bg-triton-card border border-triton-border rounded-xl overflow-hidden hover:border-triton-gold/30 transition-all duration-300 animate-fadeIn">
      <div className="relative aspect-video bg-triton-black overflow-hidden">
        {isPlaying && youtubeId && canPlay ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title || ''}
          />
        ) : (
          <>
            <img
              src={video.thumbnail || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=320&h=180&fit=crop'}
              alt={video.title || ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Play button or lock */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {canPlay ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-14 h-14 bg-triton-gold/90 rounded-full flex items-center justify-center hover:bg-triton-gold hover:scale-110 transition-all shadow-lg shadow-triton-gold/20"
                >
                  <Play className="w-6 h-6 text-triton-black ml-1" fill="currentColor" />
                </button>
              ) : (
                <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Crown className="w-6 h-6 text-triton-gold/70" />
                </div>
              )}
            </div>
            {video.platform && (
              <div className="absolute top-3 left-3 flex gap-2 z-20">
                <span className={`px-2 py-0.5 ${(platformColors[video.platform] || platformColors.other)} text-white text-xs font-bold rounded`}>
                  {video.platform.toUpperCase()}
                </span>
              </div>
            )}
            {video.duration && (
              <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                {video.duration}
              </div>
            )}
            {video.views && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/70 text-xs">
                <Play className="w-3 h-3" />
                <span>{video.views} views</span>
              </div>
            )}
            {video.is_saved && (
              <div className="absolute top-3 right-3 p-1 bg-triton-gold rounded-full z-20">
                <Star className="w-3 h-3 text-triton-black fill-triton-black" />
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-triton-text line-clamp-2 group-hover:text-triton-gold transition-colors">
          {video.title}
        </h3>
        {(video.players && video.players.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {video.players.slice(0, 3).map((p) => (
              <span key={p} className="px-2 py-0.5 text-xs bg-triton-gold/10 text-triton-gold/70 rounded">
                {p}
              </span>
            ))}
            {(video.tags || []).slice(0, 2).map((t) => (
              <span key={t} className="px-2 py-0.5 text-xs bg-triton-border text-triton-text-muted rounded">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-triton-border/50">
          <span className="text-xs text-triton-text-muted">
            {video.event || ''}{video.event && video.published_at ? ' · ' : ''}{video.published_at || ''}
          </span>
          <div className="flex gap-1">
            {onSave && (
              <button
                onClick={onSave}
                disabled={!!savingState}
                className="p-1.5 hover:bg-triton-gold/10 rounded transition-colors disabled:opacity-50"
                title={video.is_saved ? '取消收藏' : '收藏视频'}
              >
                <Star className={`w-4 h-4 ${video.is_saved ? 'text-triton-gold fill-triton-gold' : 'text-triton-text-muted hover:text-triton-gold'}`} />
              </button>
            )}
            {canPlay && video.url && (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-triton-gold/10 rounded transition-colors"
                title="打开原链接"
              >
                <ExternalLink className="w-4 h-4 text-triton-text-muted hover:text-triton-gold" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== Player Library ===================
function PlayerLibrary({ initialSearch, onSelectPlayer }: { initialSearch?: string; onSelectPlayer: (id: string) => void }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState<'name' | 'earnings' | 'titles' | 'country'>('earnings');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [filterFavorited, setFilterFavorited] = useState<boolean>(false);

  const savedPlayerIds = useAppStore(s => s.savedPlayerIds);
  const toggleSavePlayer = useAppStore(s => s.toggleSavePlayer);

  // Build unique countries and tags
  const countries = useMemo(() => {
    const set = new Set(PLAYERS.map(p => p.country));
    return Array.from(set).sort();
  }, []);

  const tags = useMemo(() => {
    const set = new Set(PLAYERS.flatMap(p => p.tags));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = [...PLAYERS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nickname?.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.bio.toLowerCase().includes(q) ||
        p.tritonResults.some(r =>
          r.eventName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
        )
      );
    }

    if (filterCountry !== 'all') {
      result = result.filter(p => p.country === filterCountry);
    }

    if (filterTag !== 'all') {
      result = result.filter(p => p.tags.includes(filterTag));
    }

    if (filterFavorited) {
      result = result.filter(p => savedPlayerIds.includes(p.id));
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'earnings') {
        const ea = parseFloat(a.totalEarnings.replace(/[^0-9.]/g, ''));
        const eb = parseFloat(b.totalEarnings.replace(/[^0-9.]/g, ''));
        return eb - ea;
      }
      if (sortBy === 'titles') {
        return (b.titles || 0) - (a.titles || 0);
      }
      if (sortBy === 'country') return a.country.localeCompare(b.country);
      return 0;
    });

    return result;
  }, [searchQuery, sortBy, filterCountry, filterTag, filterFavorited, savedPlayerIds]);

  const totalEarnings = PLAYERS.reduce((sum, p) => {
    const num = parseFloat(p.totalEarnings.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-triton-text flex items-center gap-2">
            <Users className="w-6 h-6 text-triton-gold" />
            选手库
          </h2>
          <p className="text-triton-text-muted text-sm mt-1">
            共 {PLAYERS.length} 位选手 · 总奖金 ${totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })} · 已收藏 {savedPlayerIds.length} 位
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-triton-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索选手姓名、昵称、国籍、标签、赛事..."
            className="w-full pl-10 pr-4 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text placeholder-triton-text-muted/50 outline-none focus:border-triton-gold/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-triton-text-muted hover:text-triton-text" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text outline-none appearance-none cursor-pointer"
          >
            <option value="earnings">按奖金排序</option>
            <option value="titles">按冠军数排序</option>
            <option value="name">按姓名排序</option>
            <option value="country">按国籍排序</option>
          </select>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="px-3 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text outline-none appearance-none cursor-pointer"
          >
            <option value="all">全部国籍</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-2.5 bg-triton-card border border-triton-border rounded-lg text-sm text-triton-text outline-none appearance-none cursor-pointer"
          >
            <option value="all">全部标签</option>
            {tags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={() => setFilterFavorited(!filterFavorited)}
            className={`px-3 py-2.5 rounded-lg text-sm border transition-all flex items-center gap-1 ${
              filterFavorited
                ? 'bg-triton-gold/10 border-triton-gold/30 text-triton-gold'
                : 'bg-triton-card border-triton-border text-triton-text-muted hover:text-triton-text'
            }`}
          >
            <Star className="w-4 h-4" />
            收藏
          </button>
        </div>
      </div>

      {/* Player Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-triton-text-muted/30 mx-auto mb-4" />
          <p className="text-triton-text-muted">暂无匹配的选手</p>
          <p className="text-triton-text-muted/50 text-sm mt-2">请尝试其他搜索条件</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <PlayerLibraryCard
              key={p.id}
              player={p}
              isFavorited={savedPlayerIds.includes(p.id)}
              onToggleFavorite={() => toggleSavePlayer(p.id)}
              onClick={() => onSelectPlayer(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =================== Player Library Card ===================
function PlayerLibraryCard({ player, isFavorited, onToggleFavorite, onClick }: {
  player: Player;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="group bg-triton-card border border-triton-border rounded-xl overflow-hidden hover:border-triton-gold/40 transition-all duration-300 animate-fadeIn relative"
    >
      {/* Favorite button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
      >
        <Star className={`w-4 h-4 transition-all ${isFavorited ? 'text-triton-gold fill-triton-gold' : 'text-white/60 hover:text-white'}`} />
      </button>

      <div onClick={onClick} className="cursor-pointer">
        {/* Card top with image */}
        <div className="relative h-32 bg-gradient-to-br from-triton-gold/10 to-triton-dark">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,168,78,0.15),transparent)]" />
          {player.titles >= 5 && (
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-triton-gold text-triton-black text-xs font-bold rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" /> {player.titles}冠
            </div>
          )}
        </div>
        <div className="relative -mt-10 z-10">
          <img
            src={player.image}
            alt={player.name}
            className="mx-auto w-20 h-20 rounded-full border-4 border-triton-card object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Card body */}
        <div className="pt-2 pb-5 px-5 text-center">
          <h3 className="text-lg font-bold text-triton-text group-hover:text-triton-gold transition-colors">{player.name}</h3>
          <p className="text-triton-text-muted text-sm mt-1">{player.flag} {player.country}</p>
          {player.nickname && player.nickname !== '-' && (
            <p className="text-triton-gold/60 text-xs mt-1 italic">&quot;{player.nickname}&quot;</p>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="text-center">
              <div className="text-triton-gold font-bold text-lg">{player.titles}</div>
              <div className="text-triton-text-muted">冠军</div>
            </div>
            <div className="w-px bg-triton-border" />
            <div className="text-center">
              <div className="text-triton-text font-bold text-lg">{player.cashes}</div>
              <div className="text-triton-text-muted">钱圈</div>
            </div>
            <div className="w-px bg-triton-border" />
            <div className="text-center">
              <div className="text-triton-green font-bold text-lg">{player.totalEarnings}</div>
              <div className="text-triton-text-muted">总奖金</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {player.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-triton-gold/10 text-triton-gold/70 rounded border border-triton-gold/10">
                {tag}
              </span>
            ))}
            {player.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-triton-border text-triton-text-muted rounded">
                +{player.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== Navigation ===================
function Navbar({ currentView, onNavigate, isPremium }: {
  currentView: string;
  onNavigate: (view: 'home' | 'player' | 'videos' | 'tournaments' | 'players' | 'tournamentDetail') => void;
  isPremium: boolean;
}) {
  const { t, locale, setLocale } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = [
    { id: 'home', label: '首页', icon: <PokerCardIcon className="w-4 h-4" /> },
    { id: 'tournaments', label: '赛事', icon: <Trophy className="w-4 h-4" /> },
    { id: 'players', label: '选手库', icon: <Users className="w-4 h-4" /> },
    { id: 'videos', label: '视频库', icon: <VideoIcon className="w-4 h-4" />, premium: true },
  ] as const;

  return (
    <nav className="sticky top-0 z-40 bg-triton-black/80 backdrop-blur-xl border-b border-triton-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
              <PokerCardIcon className="w-6 h-6 text-triton-gold" />
              <span className="text-lg font-bold gold-shimmer hidden sm:block">Triton Poker DB</span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    currentView === item.id
                      ? 'bg-triton-gold/10 text-triton-gold'
                      : 'text-triton-text-muted hover:text-triton-text hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {'premium' in item && item.premium && !isPremium && (
                    <Crown className="w-3.5 h-3.5 text-triton-gold/70" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5 text-triton-text" /> : <Menu className="w-5 h-5 text-triton-text" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-triton-border bg-triton-dark animate-fadeIn">
          <div className="px-4 py-3">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id as any); setMobileOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm ${
                  currentView === item.id ? 'bg-triton-gold/10 text-triton-gold' : 'text-triton-text-muted'
                }`}
              >
                {item.icon}
                {item.label}
                {'premium' in item && item.premium && !isPremium && (
                  <Crown className="w-3.5 h-3.5 text-triton-gold/70" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// =================== Video Paywall ===================
function VideoPaywall({ onSubscribe, onBack }: { onSubscribe: () => void; onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-triton-gold/10 flex items-center justify-center mb-6">
        <Crown className="w-10 h-10 text-triton-gold" />
      </div>
      <h2 className="text-2xl font-bold text-triton-text mb-3">视频库仅限订阅用户</h2>
      <p className="text-triton-text-muted max-w-md mb-8">
        视频库收录了全球顶级扑克赛事的精彩对决，支持按玩家、赛事、手牌、字幕内容等多维度搜索。订阅后即可解锁完整视频库。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSubscribe}
          className="px-8 py-3 bg-gradient-to-r from-triton-gold-dark to-triton-gold text-triton-black font-bold rounded-lg hover:from-triton-gold hover:to-triton-gold-light transition-all"
        >
          立即订阅
        </button>
        <button
          onClick={onBack}
          className="px-8 py-3 border border-triton-border text-triton-text-muted rounded-lg hover:border-triton-text-muted/30 hover:text-triton-text transition-all"
        >
          返回
        </button>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        {[
          { icon: '🎬', title: '精彩赛事回放', desc: 'WSOP、Triton、EPT 等顶级赛事' },
          { icon: '🃏', title: '手牌搜索', desc: '按手牌、玩家、关键词精准定位' },
          { icon: '📝', title: '字幕内容搜索', desc: '搜索字幕内容快速找到目标片段' },
        ].map(f => (
          <div key={f.title} className="flex flex-col items-center gap-2 p-4">
            <span className="text-2xl">{f.icon}</span>
            <span className="text-sm font-semibold text-triton-text">{f.title}</span>
            <span className="text-xs text-triton-text-muted/70">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== Footer ===================
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-triton-border bg-triton-black mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PokerCardIcon className="w-5 h-5 text-triton-gold" />
            <span className="text-sm font-bold gold-shimmer">Triton Poker DB</span>
          </div>
          <p className="text-triton-text-muted/50 text-xs text-center">
            全球扑克牌手数据库 · 数据来源于公开信息 · 仅供参考
          </p>
          <div className="flex gap-4 text-triton-text-muted/50 text-xs">
            <span>Triton Poker Series</span>
            <span>Hendon Mob</span>
            <span>MTTDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =================== Main App ===================
export default function App() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<'home' | 'player' | 'videos' | 'tournaments' | 'players' | 'tournamentDetail'>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const { isPremium } = useAuthStore();

  const selectedPlayer = useMemo(() =>
    PLAYERS.find(p => p.id === selectedPlayerId),
    [selectedPlayerId]
  );

  const selectedTournament = useMemo(() =>
    TOURNAMENTS.find(t => t.id === selectedTournamentId),
    [selectedTournamentId]
  );

  const handleSelectPlayer = useCallback((id: string) => {
    setSelectedPlayerId(id);
    setCurrentView('player');
    setSearchQuery('');
  }, []);

  const handleSearchVideos = useCallback((query: string) => {
    setVideoSearchQuery(query);
    setCurrentView('videos');
  }, []);

  const handleSelectTournament = useCallback((id: string) => {
    setSelectedTournamentId(id);
    setCurrentView('tournamentDetail');
    setSearchQuery('');
  }, []);

  const handleNavigate = useCallback((view: 'home' | 'player' | 'videos' | 'tournaments' | 'players' | 'tournamentDetail') => {
    setCurrentView(view);
    setSelectedPlayerId(null);
    setSelectedTournamentId(null);
    setSearchQuery('');
    setVideoSearchQuery('');
    setPlayerSearchQuery('');
  }, []);

  return (
    <div className="min-h-screen bg-triton-black text-triton-text">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isPremium={isPremium}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        {currentView === 'home' && !searchQuery && (
          <>
            <HeroSection />
            <StatsBar />

            {/* About Triton */}
            <section className="py-16">
              {/* Banner Image */}
              <div className="relative rounded-2xl overflow-hidden mb-12 h-64 md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=1920&q=80&fit=crop"
                  alt="Triton Poker Tournament"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-triton-black via-triton-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-triton-text mb-2">
                    <span className="gold-shimmer">Triton Poker</span> 系列赛事
                  </h2>
                  <p className="text-triton-text-muted text-sm md:text-base">
                    2016 · 至今 · 全球 14 座城市 · 累计奖金池超 $1B
                  </p>
                </div>
              </div>

              <div className="text-center mb-12">
                <p className="text-triton-text-muted max-w-3xl mx-auto leading-relaxed text-base">
                  Triton Poker Super High Roller Series 是全球最负盛名的超高额扑克系列赛事，以其奢华的举办地点、
                  顶级参赛阵容和天文数字的奖池闻名于世。赛事创立于 2016 年，至今已在全球 14 个城市举办超过 20 站比赛，
                  累计奖金池超过 10 亿美元。Triton 赛事以创新的赛制著称，涵盖 NL Hold&apos;em、Short Deck（六加一扑克）、
                  PLO 等多种玩法，买入从 $10,000 到 $1,000,000 不等，是全球顶尖扑克选手的终极竞技场。
                </p>
              </div>

              {/* Key Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  {
                    icon: Trophy,
                    title: '超高额赛事',
                    desc: '买入从 $10,000 到 $1,000,000，单场奖池最高超过 $20,000,000，吸引全球最顶尖的职业牌手和商界精英同台竞技。',
                  },
                  {
                    icon: Globe,
                    title: '全球巡回',
                    desc: '从澳门、济州到伦敦、蒙特卡洛、黑山、越南、北塞浦路斯，Triton 在全球最顶级的度假胜地举办赛事。',
                  },
                  {
                    icon: DollarSign,
                    title: '创纪录奖金',
                    desc: 'Bryn Kenney 在 2019 年伦敦站赢得 $20,500,000，创下扑克史上单场最高奖金纪录。2026 年济州站总奖池达 $85,000,000。',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-triton-card border border-triton-border rounded-xl p-6 hover:border-triton-gold/30 transition-all">
                    <div className="w-12 h-12 bg-triton-gold/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-triton-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-triton-text mb-2">{title}</h3>
                    <p className="text-triton-text-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Founders */}
            <section className="py-16 border-t border-triton-border">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-triton-gold/10 border border-triton-gold/20 rounded-full mb-4">
                  <Crown className="w-4 h-4 text-triton-gold" />
                  <span className="text-triton-gold text-sm font-semibold">创始人</span>
                </div>
                <h2 className="text-3xl font-bold text-triton-text">缔造传奇的人</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Paul Phua */}
                <div className="bg-triton-card border border-triton-border rounded-2xl overflow-hidden hover:border-triton-gold/30 transition-all group">
                  <div className="h-56 bg-gradient-to-br from-triton-gold/20 via-triton-gold/5 to-triton-dark relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face"
                      alt="Paul Phua"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-triton-card via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-3xl">🇲🇾</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-triton-text group-hover:text-triton-gold transition-colors">Paul Phua 潘保罗</h3>
                    <p className="text-triton-gold/70 text-sm mt-1">Triton Poker 联合创始人 · 董事长</p>
                    <p className="text-triton-text-muted text-sm leading-relaxed mt-4">
                      1964 年出生于马来西亚，早年在澳门从事贵宾厅中介业务，与金沙、永利等顶级赌场深度合作。
                      作为一位充满热情的扑克爱好者，他在 40 多岁才开始系统学习德州扑克，却迅速跻身全球最高额扑克圈。
                      2016 年与 Richard Yong 共同创立 Triton Poker Series，并亲自参与每一站赛事。
                      2026 年在济州站 10 周年特别赛中夺冠，赢得 $3,226,000，用一座冠军奖杯致敬自己缔造的传奇。
                    </p>
                    <div className="flex gap-3 mt-4">
                      <span className="px-3 py-1 text-xs bg-triton-gold/10 text-triton-gold rounded-full border border-triton-gold/20">累计奖金 $20M+</span>
                      <span className="px-3 py-1 text-xs bg-triton-border text-triton-text-muted rounded-full">2016 创立</span>
                    </div>
                  </div>
                </div>

                {/* Richard Yong */}
                <div className="bg-triton-card border border-triton-border rounded-2xl overflow-hidden hover:border-triton-gold/30 transition-all group">
                  <div className="h-56 bg-gradient-to-br from-triton-gold/20 via-triton-gold/5 to-triton-dark relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop&crop=face"
                      alt="Richard Yong"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-triton-card via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-3xl">🇲🇾</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-triton-text group-hover:text-triton-gold transition-colors">Richard Yong 杨理查</h3>
                    <p className="text-triton-gold/70 text-sm mt-1">Triton Poker 联合创始人 · 董事</p>
                    <p className="text-triton-text-muted text-sm leading-relaxed mt-4">
                      马来西亚华人企业家，澳门博彩业的重要推手。在澳门赌牌开放后，与 Paul Phua 及香港中介人组成联盟，
                      为金沙赌场首年增加 30% 业务，帮助永利赌场年收入增长至 70 亿美元。三人并称澳门牌坛「三个火枪手」。
                      2015 年与 Paul Phua 共同发起创立 Triton 豪客赛系列，将全球超高额扑克带入新纪元。
                      同时也是永利度假村的重要合作伙伴。
                    </p>
                    <div className="flex gap-3 mt-4">
                      <span className="px-3 py-1 text-xs bg-triton-gold/10 text-triton-gold rounded-full border border-triton-gold/20">博彩大亨</span>
                      <span className="px-3 py-1 text-xs bg-triton-border text-triton-text-muted rounded-full">永利合作伙伴</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ivan Leow Memorial */}
              <div className="max-w-5xl mx-auto mt-8">
                <div className="bg-gradient-to-r from-triton-gold/5 via-triton-card to-triton-gold/5 border border-triton-gold/20 rounded-2xl p-6 text-center">
                  <p className="text-triton-gold text-lg font-bold mb-2">In Loving Memory of Ivan Leow</p>
                  <p className="text-triton-text-muted text-sm max-w-2xl mx-auto leading-relaxed">
                    Ivan Leow（马来西亚）是 Triton Poker 的联合创始人兼核心推手之一，为 Triton 的发展做出了不可磨灭的贡献。
                    2022 年 9 月不幸离世后，Triton 以他命名了特别纪念赛事。他在牌桌上和牌桌外都深受所有人的尊敬与爱戴。
                    Paul Phua 在 2026 年济州站夺冠时，将胜利献给已故好友 Ivan，计时器定格在 2:22 — 正是 Ivan 的幸运号码。
                  </p>
                </div>
              </div>
            </section>

            {/* Tournament History Timeline */}
            <section className="py-16 border-t border-triton-border">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-triton-text">赛事历史</h2>
                <p className="text-triton-text-muted mt-2">2016 年至今，跨越 14 座城市的传奇之旅</p>
              </div>

              {/* Timeline Banner Image */}
              <div className="relative rounded-xl overflow-hidden mb-12 h-48 md:h-64">
                <img
                  src="https://images.unsplash.com/photo-1527720955777-1b36e50f8627?w=1920&q=80&fit=crop"
                  alt="Triton Poker Championship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-triton-black/80 via-triton-black/40 to-triton-black/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-triton-gold text-5xl md:text-7xl font-bold mb-2">10+</div>
                    <div className="text-triton-text text-lg md:text-xl font-medium">Years of Excellence</div>
                    <div className="text-triton-text-muted text-sm mt-1">20+ 站赛事 · 14 座城市 · $1B+ 奖金池</div>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-triton-gold/50 via-triton-border to-triton-gold/50 md:-translate-x-px" />

                {[
                  { year: '2016', location: '菲律宾马尼拉', title: 'Triton 首秀', desc: '首站赛事在菲律宾马尼拉的 Solaire Resort & Casino 举办，标志着 Triton Poker Series 的正式诞生。买入 $25,000-$100,000，吸引了来自亚洲和全球的顶尖牌手。', champion: '', prize: '' },
                  { year: '2017', location: '菲律宾马尼拉', title: '马尼拉第二季', desc: 'Triton 在马尼拉举办第二站赛事，进一步确立了亚洲超高额扑克的地位。赛事规模扩大，吸引更多国际选手参与。', champion: '', prize: '' },
                  { year: '2018', location: '澳门 / 黑山 / 马尼拉', title: '三站全球巡回', desc: '首次走出马尼拉，在澳门和黑山马久尔（Maestral Resort）举办赛事。Jason Koon 在黑山站 $1,000,000 买入赛中赢得 $3,579,836，成为 Triton 早期标志性时刻。', champion: 'Jason Koon', prize: '$3,579,836' },
                  { year: '2019', location: '黑山 / 澳门 / 济州 / 伦敦', title: '历史性的一年', desc: '全年举办四站赛事。Bryn Kenney 在伦敦站 £1,050,000 主赛事中赢得创纪录的 $20,500,000，创下扑克史上单场最高奖金纪录，至今未被打破。', champion: 'Bryn Kenney', prize: '$20,500,000' },
                  { year: '2020-2021', location: '—', title: '全球停摆', desc: '受新冠疫情影响，Triton 线下赛事暂停。这段时期促使 Triton 开始探索线上赛事和全新的运营模式，为后续的爆发式增长积蓄力量。', champion: '', prize: '' },
                  { year: '2022', location: '黑山 / 塞浦路斯 / 马德里 / 北塞浦路斯 / 伦敦', title: '王者归来', desc: '强势回归，全年举办五站赛事，足迹遍布欧洲。在伦敦举办 Triton Million 邀请赛，由专业牌手和业余富豪分别打 Day 1，再合并竞技。赛事总奖金池首次突破 $100M。', champion: '', prize: '$100M+ 总奖金池' },
                  { year: '2023', location: '越南 / 伦敦 / 北塞浦路斯 / 蒙特卡洛', title: '黄金年代', desc: '全年四站赛事，Jason Koon 在伦敦站连夺三冠，全年赢得 12 个 Triton 冠军头衔，成为 Triton 历史上最成功的选手。Phil Ivey 在短牌赛事中展现统治力。', champion: 'Jason Koon', prize: '12 冠 (历史之最)' },
                  { year: '2024', location: '济州 / 蒙特卡洛 / 伦敦', title: '超越巅峰', desc: '蒙特卡洛站举办 $200,000 Triton 邀请赛，Christoph Vogelsang 赢得 $6,000,000 冠军奖金。Patrik Antonius 同场赢得 $5,130,000。赛事规格和媒体覆盖面再创新高。', champion: 'C. Vogelsang', prize: '$6,000,000' },
                  { year: '2025', location: '黑山 / 济州', title: '新纪元开启', desc: '黑山站 Jason Koon 在 $150,000 主赛事夺冠。济州站首创 Triton ONE 开放赛事，买入降低至可承受范围，首次向大众扑克爱好者开放，285 人参赛，Josh Mccully 夺冠。', champion: 'Jason Koon', prize: '$3,393,656' },
                  { year: '2026', location: '济州', title: '十周年庆典', desc: 'Triton 迎来十周年，在济州举办纪念站。Paul Phua 在 $150,000 十周年特别赛中夺冠，赢得 $3,226,000，用冠军奖杯致敬自己缔造的传奇。总奖金池 $85,000,000 创下系列赛纪录。', champion: 'Paul Phua', prize: '$3,226,000' },
                ].map((item, i) => (
                  <div key={item.year} className={`relative flex items-start mb-10 md:mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-triton-gold rounded-full -translate-x-1.5 mt-2 ring-4 ring-triton-black z-10" />

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-0 md:text-right' : 'md:pl-0'}`}>
                      <div className="bg-triton-card border border-triton-border rounded-xl p-5 hover:border-triton-gold/30 transition-all inline-block">
                        <div className="flex items-center gap-2 mb-2 flex-wrap" style={{ justifyContent: 'inherit' }}>
                          <span className="text-triton-gold font-bold text-lg">{item.year}</span>
                          <span className="text-triton-text-muted text-sm flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" /> {item.location}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-triton-text mb-2">{item.title}</h3>
                        <p className="text-triton-text-muted text-sm leading-relaxed">{item.desc}</p>
                        {item.champion && (
                          <div className="mt-3 flex gap-2 flex-wrap" style={{ justifyContent: 'inherit' }}>
                            <span className="px-3 py-1 text-xs bg-triton-gold/10 text-triton-gold rounded-full border border-triton-gold/20 flex items-center gap-1">
                              <Trophy className="w-3 h-3" /> {item.champion}
                            </span>
                            {item.prize && (
                              <span className="px-3 py-1 text-xs bg-triton-green/10 text-triton-green rounded-full">
                                {item.prize}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Tournaments */}
            <section className="py-16 border-t border-triton-border">
              <div className="relative rounded-xl overflow-hidden mb-8 h-44 md:h-56">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80&fit=crop"
                  alt="Casino tournament"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-triton-black via-triton-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center px-8">
                  <div>
                    <h2 className="text-3xl font-bold text-triton-text mb-1">2026 赛事日程</h2>
                    <p className="text-triton-text-muted">Triton Poker 十周年赛季 · 更多站次即将公布</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end mb-8">
                <button
                  onClick={() => setCurrentView('tournaments')}
                  className="text-sm text-triton-gold hover:underline flex items-center gap-1"
                >
                  全部赛事 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOURNAMENTS.slice(0, 6).map(t => (
                  <TournamentCard key={t.id} tournament={t} onClick={() => handleSelectTournament(t.id)} />
                ))}
              </div>
            </section>
          </>
        )}

        {currentView === 'home' && searchQuery && (
          <div className="py-8">
            <SearchResults
              query={searchQuery}
              onSelectPlayer={handleSelectPlayer}
              onSelectTournament={handleSelectTournament}
              onSearchVideos={handleSearchVideos}
            />
          </div>
        )}

        {currentView === 'player' && selectedPlayer && (
          <div className="py-8">
            <PlayerDetail
              player={selectedPlayer}
              onBack={() => { setCurrentView(selectedTournamentId ? 'tournamentDetail' : 'home'); setSelectedPlayerId(null); }}
              onSearchVideos={handleSearchVideos}
            />
          </div>
        )}

        {currentView === 'tournamentDetail' && selectedTournament && (
          <div className="py-8">
            <TournamentDetail
              tournament={selectedTournament}
              onBack={() => { setCurrentView('tournaments'); setSelectedTournamentId(null); }}
              onSelectPlayer={handleSelectPlayer}
            />
          </div>
        )}

        {currentView === 'videos' && (
          <div className="py-8">
            {isPremium ? (
              <VideoLibrary initialSearch={videoSearchQuery || undefined} />
            ) : (
              <VideoPaywall
                onSubscribe={() => setShowPaywall(true)}
                onBack={() => setCurrentView('home')}
              />
            )}
          </div>
        )}

        {currentView === 'players' && (
          <div className="py-8">
            <PlayerLibrary
              initialSearch={playerSearchQuery || undefined}
              onSelectPlayer={handleSelectPlayer}
            />
          </div>
        )}

        {currentView === 'tournaments' && (
          <div className="py-8 animate-fadeIn">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-triton-gold" />
              <h2 className="text-2xl font-bold text-triton-text">全部赛事</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOURNAMENTS.map(t => (
                <TournamentCard key={t.id} tournament={t} onClick={() => handleSelectTournament(t.id)} />
              ))}
            </div>


          </div>
        )}
      </main>

      <Footer />

      {showPaywall && (
        <PaywallModal
          feature="视频库"
          onClose={() => setShowPaywall(false)}
          onLogin={() => { setShowPaywall(false); setCurrentView('home'); }}
        />
      )}
    </div>
  );
}
