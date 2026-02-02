export default function SettingsPage() {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#050505] p-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-fira-code">
          设置
        </h1>
        <p className="text-slate-400 mt-2">
          管理您的账户和系统设置
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Settings */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 font-fira-code">
            账户设置
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full px-4 py-2 bg-[#0B1220] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                defaultValue="admin@example.com"
                className="w-full px-4 py-2 bg-[#0B1220] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                电话号码
              </label>
              <input
                type="tel"
                defaultValue="+86 13800138000"
                className="w-full px-4 py-2 bg-[#0B1220] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 font-fira-code">
            通知偏好
          </h3>

          <div className="space-y-4">
            {[
              { label: '邮件通知', description: '接收重要操作的邮件提醒' },
              { label: '订单通知', description: '新订单和订单更新提醒' },
              { label: '用户反馈', description: '接收用户反馈和评论通知' },
              { label: '系统通知', description: '系统维护和更新通知' },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors duration-200">
                <div>
                  <p className="font-medium text-white">
                    {setting.label}
                  </p>
                  <p className="text-sm text-slate-400">
                    {setting.description}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded cursor-pointer accent-[#22D3EE]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 font-fira-code">
            隐私与安全
          </h3>

          <div className="space-y-4">
            <button className="w-full px-4 py-2 text-left bg-[#0B1220] border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-colors duration-200 cursor-pointer font-medium text-white">
              更改密码
            </button>
            <button className="w-full px-4 py-2 text-left bg-[#0B1220] border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-colors duration-200 cursor-pointer font-medium text-white">
              启用两步认证
            </button>
            <button className="w-full px-4 py-2 text-left bg-[#0B1220] border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-colors duration-200 cursor-pointer font-medium text-white">
              查看登录历史
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6">
          <h3 className="text-lg font-semibold text-[#EF4444] mb-4 font-fira-code">
            危险操作
          </h3>
          <button className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors duration-200 cursor-pointer font-medium">
            删除账户
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4">
        <button className="px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-[#050505] rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all duration-200 cursor-pointer font-medium">
          保存更改
        </button>
        <button className="px-6 py-2 bg-white/5 border border-white/10 hover:border-white/30 text-white rounded-lg transition-colors duration-200 cursor-pointer font-medium">
          取消
        </button>
      </div>
    </div>
  );
}
