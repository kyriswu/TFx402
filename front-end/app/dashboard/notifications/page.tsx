export default function NotificationsPage() {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#050505] p-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-fira-code">
          通知
        </h1>
        <p className="text-slate-400 mt-2">
          查看和管理您的所有通知
        </p>
      </div>

      {/* Notification Filters */}
      <div className="flex gap-3 flex-wrap">
        {['全部', '未读', '系统', '用户', '订单'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-colors duration-200 cursor-pointer font-medium"
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
            className={`p-4 rounded-2xl border-l-4 cursor-pointer hover:shadow-lg hover:shadow-white/5 transition-all duration-200 ${
              notification.unread
                ? 'bg-[#22D3EE]/10 border-[#22D3EE]'
                : 'bg-white/5 border-white/10'
            } border border-white/10`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">
                    {notification.title}
                  </h4>
                  {notification.unread && (
                    <span className="w-2 h-2 bg-[#22D3EE] rounded-full" />
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {notification.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                  notification.type === 'order'
                    ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                    : notification.type === 'user'
                      ? 'bg-[#22D3EE]/20 text-[#22D3EE]'
                      : 'bg-[#10B981]/20 text-[#10B981]'
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
