export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-dark dark:text-white font-fira-code">
          总览
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
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
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</p>
            <p className="text-3xl font-bold text-primary mt-2">{kpi.value}</p>
            <p className={`text-sm mt-2 ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.positive ? '↑' : '↓'} {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-text-dark dark:text-white mb-4">
          销售趋势
        </h2>
        <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 rounded flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">图表数据加载中...</p>
        </div>
      </div>
    </div>
  );
}
