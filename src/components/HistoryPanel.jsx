const HistoryPanel = ({ history, reachNumbers }) => {
    return (
        <div className="flex flex-col h-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl overflow-hidden">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3 border-b border-white/20 pb-2 font-display">REACH</h3>
                <div className="flex flex-wrap gap-2">
                    {reachNumbers.length === 0 ? (
                        <span className="text-gray-400 text-sm">No reach yet</span>
                    ) : (
                        reachNumbers.map((num, i) => (
                            <span key={i} className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white text-xl font-black shadow-lg animate-pulse border-2 border-white/50">
                                {num}
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-bold text-white mb-3 border-b border-white/20 pb-2 font-display">HISTORY</h3>
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
