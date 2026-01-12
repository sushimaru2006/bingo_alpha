const HistoryPanel = ({ history, reachNumbers }) => {
    return (
        <div className="flex flex-col h-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-y-auto custom-scrollbar">
            <div className="p-6 pb-0">
                <h3 className="text-xl font-bold text-white mb-3 border-b border-white/20 pb-2 font-display sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-2 -mt-2">REACH</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {reachNumbers.length === 0 ? (
                        <span className="text-gray-400 text-sm">No reach yet</span>
                    ) : (
                        reachNumbers.map((num, i) => {
                            const isHit = history.includes(num);
                            return (
                                <span key={i} className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-black shadow-lg border-2 transition-all duration-500 ${isHit ? 'bg-yellow-400 text-black border-yellow-200 scale-90' : 'bg-red-500 text-white animate-pulse border-white/50'}`}>
                                    {num}
                                </span>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="flex-1 p-6 pt-0">
                <h3 className="text-xl font-bold text-white mb-3 border-b border-white/20 pb-2 font-display sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 py-2">HISTORY</h3>
                <div className="flex flex-wrap gap-2 content-start">
                    {history.map((num, i) => (
                        <span key={i} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-black font-bold shadow-sm border border-yellow-600">
                            {num}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPanel;
