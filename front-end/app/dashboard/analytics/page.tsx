export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-dark dark:text-white font-fira-code">
          分析报表
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          深入分析您的业务数据和用户行为
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4">
            流量来源分布
          </h3>
          <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 rounded flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">饼图数据</p>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4">
            用户增长趋势
          </h3>
          <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 rounded flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">折线图数据</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4">
          日均数据
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">日期</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">访客数</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">页面浏览</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">转化率</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    2024-01-{15 + idx}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {1200 + idx * 100}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {5600 + idx * 200}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
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
