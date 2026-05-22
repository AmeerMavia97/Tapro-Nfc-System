import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const ScanLineChart = ({ data = [], height = 300 }) => {
  const chartData = Array.isArray(data) ? data : []

  return (
    <div className="h-[300px] w-full rounded-[28px] bg-white p-5">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e2e8f0" />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={4}
            fill="url(#scanFill)"
            dot={{ r: 5, strokeWidth: 3, fill: "#ffffff", stroke: "#2563eb" }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ScanLineChart