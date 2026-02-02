export default function AnalyticsPage() {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#050505] p-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-fira-code">
          分析报表
        </h1>
        <p className="text-slate-400 mt-2">
          深入分析您的业务数据和用户行为
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            流量来源分布
          </h3>
          <div className="h-80 rounded-xl border border-white/10 bg-gradient-to-br from-[#8B5CF6]/10 to-[#22D3EE]/10 flex items-center justify-center">
            <p className="text-slate-400">饼图数据</p>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            用户增长趋势
          </h3>
          <div className="h-80 rounded-xl border border-white/10 bg-gradient-to-br from-[#8B5CF6]/10 to-[#22D3EE]/10 flex items-center justify-center">
            <p className="text-slate-400">折线图数据</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          日均数据
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">日期</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">访客数</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">页面浏览</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">转化率</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors duration-200">
                  <td className="py-3 px-4 text-slate-200">
                    2024-01-{15 + idx}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {1200 + idx * 100}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {5600 + idx * 200}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-[#10B981]/20 text-[#10B981]">
                      {(3.2 + idx * 0.1).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
