export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-dark dark:text-white font-fira-code">
          通知
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          查看和管理您的所有通知
        </p>
      </div>

      {/* Notification Filters */}
      <div className="flex gap-3 flex-wrap">
        {['全部', '未读', '系统', '用户', '订单'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-primary dark:hover:border-primary hover:text-primary transition-colors duration-200 cursor-pointer font-medium"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {[
          {
            title: '新订单通知',
            message: '您收到了一个新订单 #12345',
            time: '5 分钟前',
            unread: true,
            type: 'order',
          },
          {
            title: '用户反馈',
            message: 'John Doe 提交了一条反馈意见',
            time: '1 小时前',
            unread: true,
            type: 'user',
          },
          {
            title: '系统通知',
            message: '系统维护已完成，所有功能正常',
            time: '3 小时前',
            unread: false,
            type: 'system',
          },
          {
            title: '订单发货',
            message: '订单 #12340 已发货，跟踪号: ABC123',
            time: '1 天前',
            unread: false,
            type: 'order',
          },
          {
            title: '新评论',
            message: 'Jane Smith 在您的内容上发表了评论',
            time: '2 天前',
            unread: false,
            type: 'user',
          },
        ].map((notification, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
              notification.unread
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
            } border border-gray-200 dark:border-slate-700`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-dark dark:text-white">
                    {notification.title}
                  </h4>
                  {notification.unread && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {notification.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                  notification.type === 'order'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : notification.type === 'user'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }`}
              >
                {notification.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
