import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboardService"
import { TrendingUp, Building, User, Wrench } from "lucide-react"

const Dashboard = () => {
	const {
		data: analytics,
		isLoading: analyticsLoading,
		isError: analyticsError,
	} = useQuery({
		queryKey: ["analytics"],
		queryFn: async () => await dashboardService.getAnalytics(),
	})

	const {
		data: activeTools,
		isLoading: toolsLoading,
		isError: toolsError,
	} = useQuery({
		queryKey: ["activeTools"],
		queryFn: async () => await dashboardService.getActiveTools(),
	})

	const {
		data: recentTools,
		isLoading: recentToolsLoading,
		isError: recentToolsError,
	} = useQuery({
		queryKey: ["tools"],
		queryFn: async () => await dashboardService.getRecentTools(),
	})

	const {
		data: departments,
		isLoading: departmentsLoading,
		isError: departmentsError,
	} = useQuery({
		queryKey: ["departments"],
		queryFn: async () => await dashboardService.getDepartment(),
	})

	const isLoading = analyticsLoading || toolsLoading || recentToolsLoading || departmentsLoading
	const isError = analyticsError || toolsError || recentToolsError || departmentsError

	if (isLoading) {
		return <div className="min-h-screen bg-black text-white p-6">Loading...</div>
	}

	if (isError) {
		return <div className="min-h-screen bg-black text-red-400 p-6">Error loading dashboard</div>
	}

	return (
		<div className="px-6 pb-6 min-h-screen bg-neutral-950">
			{/* Titre */}
			<h1 className="text-4xl font-bold mb-6 text-white">Internal Tools Dashboard</h1>
			<p className="text-white text-xl mb-5">Monitor and manage your organization's software tools and expenses</p>

			{/* KPI */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				{/* Monthly budget */}
				<div className="border border-gray-700/50 bg-black rounded-xl p-6 flex flex-col justify-between shadow relative">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-white text-lg font-medium">Monthly budget</h2>
						<TrendingUp className="h-8 w-8 text-white rounded bg-gradient-to-br from-green-300 to-green-500 p-1" />
					</div>
					<p className="text-white text-3xl font-bold">
						€{analytics && analytics.budget_overview.current_month_total}/€
						{analytics &&
							(analytics.budget_overview.monthly_limit >= 1000
								? `${(analytics.budget_overview.monthly_limit / 1000).toFixed(0)}k`
								: analytics.budget_overview.monthly_limit)}
					</p>
					<p className="inline-block mt-2 px-2 py-1 rounded-full text-sm text-white font-semibold bg-gradient-to-br from-green-300 to-green-500 text-black w-max">
						{analytics && analytics.kpi_trends.budget_change}
					</p>
				</div>

				{/* Active tools */}
				<div className="border border-gray-700/50 bg-black rounded-xl p-6 flex flex-col justify-between shadow relative">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-white text-lg font-medium">Active tools</h2>
						<Wrench className="h-8 w-8 text-white rounded bg-gradient-to-br from-blue-400 to-violet-500 p-1" />
					</div>
					<p className="text-white text-3xl font-bold">{activeTools && activeTools.length}</p>
					<p className="inline-block mt-2 px-2 py-1 rounded-full text-sm text-white font-semibold bg-gradient-to-br from-blue-400 to-violet-500 text-black w-max">
						{analytics && analytics.kpi_trends.tools_change}
					</p>
				</div>

				{/* Department */}
				<div className="border border-gray-700/50 bg-black rounded-xl p-6 flex flex-col justify-between shadow relative">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-white text-lg font-medium">Departments</h2>
						<Building className="h-8 w-8 text-white rounded bg-gradient-to-br from-orange-400 to-pink-500 p-1" />
					</div>
					<p className="text-white text-3xl font-bold">{departments && departments.length}</p>
					<p className="inline-block mt-2 px-2 py-1 rounded-full text-sm text-white font-semibold bg-gradient-to-br from-orange-400 to-pink-500 text-black w-max">
						{analytics && analytics.kpi_trends.departments_change}
					</p>
				</div>

				{/* Cost/user */}
				<div className="border border-gray-700/50 bg-black rounded-xl p-6 flex flex-col justify-between shadow relative">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-white text-lg font-medium">Cost/User</h2>
						<User className="h-8 w-8 text-white rounded bg-gradient-to-br from-pink-400 to-red-500 p-1" />
					</div>
					<p className="text-white text-3xl font-bold">{analytics && analytics.cost_analytics.cost_per_user}</p>
					<p className="inline-block mt-2 px-2 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-red-500 text-black w-max">
						{analytics && analytics.kpi_trends.cost_per_user_change}
					</p>
				</div>
			</div>

			{/* Recent tools */}
			<div className="border border-gray-700/50 bg-black rounded-xl p-6 shadow">
				<h2 className="text-white text-lg font-medium mb-2">Recent tools</h2>
				<div className="grid grid-cols-5 text-sm text-gray-400 pb-2 border-b border-gray-700">
					<span>Tool</span>
					<span>Department</span>
					<span>Users</span>
					<span>Monthly cost</span>
					<span>Status</span>
				</div>

				<div className="divide-y divide-gray-800">
					{recentTools &&
						recentTools.map((tool) => (
							<div key={tool.id} className="grid grid-cols-5 items-center py-3 text-gray-200 hover:bg-gray-900/50 transition">
								<div className="flex items-center gap-3">
									<img src={tool.icon_url} alt={`${tool.name} icon`} className="h-7 w-7 rounded-md object-contain" />
									<span className="font-medium text-white">{tool.name}</span>
								</div>
								<span>{tool.owner_department}</span>
								<span>{tool.active_users_count}</span>
								<span>€{tool.monthly_cost}</span>
								<span
									className={`w-max px-2 py-1 rounded-full text-xs font-semibold ${
										tool.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
									}`}
								>
									{tool.status}
								</span>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default Dashboard
