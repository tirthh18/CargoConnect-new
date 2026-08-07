import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

export default function Chart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-lg font-semibold text-[#1B1B2F] mb-6">Monthly Orders</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={true} stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94A3B8", fontSize: 13 }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#1B1B2F", fontWeight: 600 }}
              formatter={(value) => [`orders : ${value}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8B7CF6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#fff", stroke: "#8B7CF6", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#8B7CF6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}