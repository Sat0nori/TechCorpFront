import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../hooks/toolService"

const Analytics = () => {
	const {
		data: analytics,
		isLoading: analyticsLoading,
		isError: analyticsError,
	} = useQuery({
		queryKey: ["analytics"],
		queryFn: async () => await dashboardService.getAnalytics(),
	})

	const {
		data: tools,
		isLoading: toolsLoading,
		isError: toolsError,
	} = useQuery({
		queryKey: ["tools"],
		queryFn: async () => await dashboardService.getTools(),
	})

	const isLoading = analyticsLoading || toolsLoading
	const isError = analyticsError || toolsError
	if (isLoading) return <div className="min-h-screen bg-black text-white p-6">Loading...</div>
	if (isError) return <div className="min-h-screen bg-black text-red-400 p-6">Error loading dashboard</div>
	if (!analytics) return <div className="min-h-screen bg-black text-red-400 p-6">No analytics data available</div>
	if (!tools) return <div className="min-h-screen bg-black text-red-400 p-6">No tools data available</div>

	//Budget progress
	const { budget_overview, kpi_trends } = analytics
	const currentPercent = (budget_overview.current_month_total / budget_overview.monthly_limit) * 100
	const previousPercent = (budget_overview.previous_month_total / budget_overview.monthly_limit) * 100

	const items = [
		{ label: "Budget change", value: kpi_trends.budget_change },
		{ label: "Tools change", value: kpi_trends.tools_change },
		{ label: "Departments change", value: kpi_trends.departments_change },
		{ label: "Cost / user", value: kpi_trends.cost_per_user_change },
	]

	// Department Cost Breakdown
	const departmentCosts = tools.reduce<Record<string, number>>((acc, tool) => {
		const dept = tool.owner_department || "Unknown"
		acc[dept] = (acc[dept] || 0) + tool.monthly_cost
		return acc
	}, {})
	const departments = Object.entries(departmentCosts).map(([name, value]) => ({ name, value }))
	const totalCost = departments.reduce((sum, d) => sum + d.value, 0)
	const radius = 45
	const circumference = 2 * Math.PI * radius
	let cumulativePercent = 0

	//Top expensive tools
	const topTools = [...tools].sort((a, b) => (b.monthly_cost ?? 0) - (a.monthly_cost ?? 0)).slice(0, 5)
	const maxCost = topTools[0]?.monthly_cost || 1

	return (
		<div className="min-h-screen bg-neutral-950 pl-3 pr-3">
			{/* Monthly Spend Evolution */}
			<div className="bg-black border border-gray-700 rounded-xl p-6">
				<h3 className="text-white text-lg font-medium mb-4">Monthly Spend Evolution</h3>
				<svg viewBox="0 0 100 50" className="w-full h-32 mb-4">
					<defs>
						<linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
							<stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
						</linearGradient>
					</defs>
					<polyline points={`0,${50 - previousPercent / 2} 100,${50 - currentPercent / 2}`} fill="none" stroke="#3b82f6" strokeWidth="2" />
					<polygon points={`0,50 0,${50 - previousPercent / 2} 100,${50 - currentPercent / 2} 100,50`} fill="url(#budgetGradient)" />
				</svg>
				<div className="flex justify-between text-sm mb-1">
					<span className="text-gray-400">
						€{budget_overview.current_month_total} / €{budget_overview.monthly_limit}
					</span>
					<span className={`font-medium ${budget_overview.trend_percentage.startsWith("+") ? "text-red-400" : "text-green-400"}`}>
						{budget_overview.trend_percentage}%
					</span>
				</div>
				<div className="h-3 bg-gray-800 rounded-full overflow-hidden">
					<div className={`h-full ${currentPercent > 90 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${currentPercent}%` }} />
				</div>
				<p className="mt-2 text-sm text-gray-400">Budget utilization: {budget_overview.budget_utilization}</p>
			</div>

			{/* Budget Progress */}
			<h1 className="text-3xl text-white mt-3">Budget Progress</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
				{items.map((item) => (
					<div key={item.label} className="bg-black border border-gray-700 rounded-xl p-4">
						<p className="text-gray-400 text-sm">{item.label}</p>
						<p className={`text-xl font-semibold mt-1 ${item.value.startsWith("-") ? "text-green-400" : "text-red-400"}`}>{item.value}</p>
					</div>
				))}
			</div>

			{/* Department Cost Breakdown */}
			<div className="bg-black border border-gray-700 rounded-xl p-6 mt-6">
				<h3 className="text-white text-lg font-medium mb-4">Department Cost Breakdown</h3>
				<div className="flex flex-col md:flex-row items-center gap-6">
					{/* Donut */}
					<div className="relative w-48 h-48">
						<svg viewBox="0 0 100 100" className="w-full h-full">
							<circle cx="50" cy="50" r={radius} fill="transparent" stroke="#1f2937" strokeWidth="10" />
							{departments.map((dept, index) => {
								const percent = dept.value / totalCost
								const dashArray = `${percent * circumference} ${circumference}`
								const dashOffset = -cumulativePercent * circumference
								cumulativePercent += percent
								return (
									<circle
										key={dept.name}
										cx="50"
										cy="50"
										r={radius}
										fill="transparent"
										stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
										strokeWidth="10"
										strokeDasharray={dashArray}
										strokeDashoffset={dashOffset}
										strokeLinecap="round"
										transform="rotate(-90 50 50)"
									/>
								)
							})}
						</svg>

						{/* Center total */}
						<div className="absolute inset-0 flex flex-col items-center justify-center">
							<p className="text-gray-400 text-sm">Total</p>
							<p className="text-white text-xl font-semibold">€{totalCost.toFixed(0)}</p>
						</div>
					</div>

					{/* Legend */}
					<div className="flex-1 w-full space-y-3">
						{departments.map((dept, index) => {
							const percent = ((dept.value / totalCost) * 100).toFixed(1)
							return (
								<div key={dept.name} className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-3">
										<span
											className="w-3 h-3 rounded-full"
											style={{
												backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
											}}
										/>
										<span className="text-gray-300">{dept.name}</span>
									</div>
									<div className="text-gray-400">
										€{dept.value.toFixed(0)} ({percent}%)
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			{/* Top Expensive Tools */}
			<div className="bg-black border border-gray-700 rounded-xl p-6 mt-6">
				<h3 className="text-white text-lg font-medium mb-4">Top Expensive Tools</h3>
				<div className="flex flex-col gap-4">
					{topTools.map((tool, index) => {
						const cost = tool.monthly_cost ?? 0
						const widthPercent = (cost / maxCost) * 100
						const color = `hsl(${(index * 60) % 360}, 70%, 50%)`
						return (
							<div key={tool.id} className="flex items-center gap-4">
								<div className="w-24 text-gray-300 text-sm shrink-0">{tool.name}</div>
								<div className="flex-1 bg-gray-800 h-6 rounded-full overflow-hidden">
									<div
										className="h-full rounded-full"
										style={{
											width: `${widthPercent}%`,
											backgroundColor: color,
										}}
									/>
								</div>
								<div className="w-16 text-gray-400 text-sm text-right">€{cost.toFixed(0)}</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Analytics
