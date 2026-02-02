export default function OverviewPage() {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#050505] text-slate-100 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-fira-code">
          总览
        </h1>
        <p className="text-slate-400 mt-2">
          查看您的业务关键指标和实时数据
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '总销售额', value: '¥324,521', change: '+12.5%', positive: true },
          { label: '订单数', value: '1,234', change: '+8.2%', positive: true },
          { label: '平均订单值', value: '¥263', change: '-2.1%', positive: false },
          { label: '客户满意度', value: '4.8/5', change: '+0.2', positive: true },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 transition-all duration-200 cursor-pointer"
          >
            <p className="text-sm text-slate-400">{kpi.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>
            <p
              className={`text-sm mt-2 ${
                kpi.positive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            >
              {kpi.positive ? '↑' : '↓'} {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          销售趋势
        </h2>
        <div className="h-64 rounded-xl border border-white/10 bg-gradient-to-br from-[#8B5CF6]/10 to-[#22D3EE]/10 flex items-center justify-center">
          <p className="text-slate-400">图表数据加载中...</p>
        </div>
      </div>
    </div>
  );
}
