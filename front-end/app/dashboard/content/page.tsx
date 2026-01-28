export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-dark dark:text-white font-fira-code">
          内容管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          管理和发布您的内容
        </p>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '已发布', value: '28', color: 'from-blue-500' },
          { label: '草稿', value: '12', color: 'from-yellow-500' },
          { label: '总浏览', value: '5.2K', color: 'from-green-500' },
          { label: '评论', value: '342', color: 'from-purple-500' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} to-transparent p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all duration-200`}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-dark dark:text-white">
            最新内容
          </h3>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer font-medium">
            + 新建内容
          </button>
        </div>

        {[
          { title: '如何优化性能', status: '已发布', date: '2024-01-20', views: '1.2K' },
          { title: 'Next.js 最佳实践', status: '已发布', date: '2024-01-18', views: '892' },
          { title: 'React Hooks 深入', status: '草稿', date: '2024-01-15', views: '0' },
          { title: '前端性能监测', status: '已发布', date: '2024-01-12', views: '654' },
        ].map((content, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-text-dark dark:text-white">
                  {content.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  发布于 {content.date} · {content.views} 次浏览
                </p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  content.status === '已发布'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                }`}
              >
                {content.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
