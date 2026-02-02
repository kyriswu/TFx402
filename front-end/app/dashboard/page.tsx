export default function DashboardPage() {
  return (
    <div className="space-y-8 rounded-2xl border border-white/10 bg-[#050505] p-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-fira-code">
          欢迎回来
        </h1>
        <p className="text-slate-400 mt-2">
          选择左侧菜单开始工作
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '总用户', value: '2,451' },
          { label: '活跃用户', value: '1,234' },
          { label: '收入', value: '¥54,231' },
          { label: '转化率', value: '12.5%' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 transition-all duration-200"
          >
            <p className="text-sm text-slate-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-white mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          最近活动
        </h2>
        <div className="space-y-3">
          {[
            '新用户注册: John Doe',
            '订单支付成功: Order #12345',
            '系统维护完成',
            '新功能发布: 数据导出',
          ].map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#0B1220] cursor-pointer hover:border-white/20 hover:bg-white/5 transition-colors duration-200"
            >
              <div className="w-2 h-2 bg-[#22D3EE] rounded-full" />
              <p className="text-sm text-slate-300">
                {activity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
