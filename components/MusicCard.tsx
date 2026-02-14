'use client';

import React from 'react';
import YouTube from 'react-youtube';

interface MusicCardProps {
    videoId: string;
    reason: string;
    mood: string;
}

export const MusicCard: React.FC<MusicCardProps> = ({ videoId, reason, mood }) => {
    const [hasError, setHasError] = React.useState(false);

    const opts = {
        height: '180',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg transition-all hover:scale-[1.02]">
            <div className="bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-300">
                🎵 Recommended for your mood: <span className="text-white capitalize">{mood}</span>
            </div>

            <div className="relative aspect-video w-full bg-slate-900/50">
                {!hasError ? (
                    <YouTube
                        videoId={videoId}
                        opts={opts}
                        className="w-full h-full"
                        iframeClassName="w-full h-full rounded-none"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <p className="mb-2">Video unavailable</p>
                        <a
                            href={`https://open.spotify.com/search/${encodeURIComponent(reason)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 underline text-sm"
                        >
                            Listen on Spotify instead
                        </a>
                    </div>
                )}
            </div>

            <div className="p-4 text-sm text-slate-300 italic">
                "{reason}"
            </div>
        </div>
    );
};
