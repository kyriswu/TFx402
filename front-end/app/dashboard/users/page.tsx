export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-dark dark:text-white font-fira-code">
          用户管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          管理和查看所有用户信息
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '总用户', value: '2,451', color: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: '活跃用户', value: '1,234', color: 'bg-green-50 dark:bg-green-900/10' },
          { label: '新用户（本月）', value: '342', color: 'bg-purple-50 dark:bg-purple-900/10' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.color} rounded-lg p-6 border border-gray-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all duration-200`}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-text-dark dark:text-white">
            用户列表
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-semibold text-sm">用户名</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-semibold text-sm">邮箱</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-semibold text-sm">状态</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-semibold text-sm">加入时间</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', email: 'john@example.com', status: '活跃', date: '2024-01-10' },
                { name: 'Jane Smith', email: 'jane@example.com', status: '活跃', date: '2024-01-12' },
                { name: 'Bob Johnson', email: 'bob@example.com', status: '非活跃', date: '2024-01-08' },
                { name: 'Alice Williams', email: 'alice@example.com', status: '活跃', date: '2024-01-15' },
                { name: 'Charlie Brown', email: 'charlie@example.com', status: '活跃', date: '2024-01-14' },
              ].map((user, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-gray-900 dark:text-gray-100 font-medium">{user.name}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === '活跃'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
