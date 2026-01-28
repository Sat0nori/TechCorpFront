import { useQuery } from "@tanstack/react-query"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { dashboardService } from "../hooks/toolService"

const Tools = () => {
	const [openMenuId, setOpenMenuId] = useState<number | null>(null)
	const [filters, setFilters] = useState({
		department: "",
		status: "",
		category: "",
	})

	const {
		data: departments = [],
		isLoading: departmentsLoading,
		isError: departmentsError,
	} = useQuery({
		queryKey: ["departments"],
		queryFn: async () => await dashboardService.getDepartment(),
	})

	const {
		data: tools = [],
		isLoading: toolsFilterLoading,
		isError: toolsFilterError,
	} = useQuery({
		queryKey: ["Tools"],
		queryFn: async () => await dashboardService.getTools(),
	})

	const isLoading = toolsFilterLoading || departmentsLoading
	const isError = toolsFilterError || departmentsError

	if (isLoading) return <div className="min-h-screen bg-black text-white p-6">Loading...</div>
	if (isError) return <div className="min-h-screen bg-black text-red-400 p-6">Error loading dashboard</div>

	const filteredTools = tools.filter((tool) => {
		return (
			(filters.department === "" || tool.owner_department === filters.department) &&
			(filters.status === "" || tool.status === filters.status) &&
			(filters.category === "" || tool.category === filters.category)
		)
	})

	const statuses = Array.from(new Set(tools.map((t) => t.status)))
	const categories = Array.from(new Set(tools.map((t) => t.category)))

	return (
		<div className="min-h-screen bg-black">
			{/* Title and Filter*/}
			<div className="flex px-6 items-center justify-between mb-4">
				<h2 className="text-white text-4xl font-medium">Tools</h2>
				<div className="flex flex-wrap items-center gap-3">
					<select
						value={filters.department}
						onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
						className="rounded-lg border border-gray-700 bg-neutral-900 px-3 py-2 text-sm text-gray-300"
					>
						<option value="">All departments</option>
						{departments.map((element, index) => (
							<option key={index} value={element.name}>
								{element.name}
							</option>
						))}
					</select>

					<select
						value={filters.status}
						onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
						className="rounded-lg border border-gray-700 bg-neutral-900 px-3 py-2 text-sm text-gray-300"
					>
						<option value="">All statuses</option>
						{statuses.map((status, idx) => (
							<option key={idx} value={status}>
								{status}
							</option>
						))}
					</select>

					<select
						value={filters.category}
						onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
						className="rounded-lg border border-gray-700 bg-neutral-900 px-3 py-2 text-sm text-gray-300"
					>
						<option value="">All categories</option>
						{categories.map((cat, idx) => (
							<option key={idx} value={cat}>
								{cat}
							</option>
						))}
					</select>

					<button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
						Add tool
					</button>
				</div>
			</div>

			{/* Tools */}
			<div className="border border-gray-700/50 bg-black rounded-xl p-6 shadow">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-white text-lg font-medium">Tools</h2>
				</div>
				<div className="grid grid-cols-10 text-sm text-gray-400 pb-2 border-b border-gray-700">
					<span>Tool</span>
					<span>Vendor</span>
					<span>Department</span>
					<span>Category</span>
					<span>Users</span>
					<span>Monthly cost</span>
					<span>Status</span>
					<span>Last Update</span>
					<span>Descritpion</span>
				</div>

				<div className="divide-y divide-gray-800">
					{filteredTools &&
						filteredTools.map((tool) => (
							<div key={tool.id} className="grid grid-cols-10 items-center py-3 text-gray-200 hover:bg-gray-900/50 transition">
								<div className="flex items-center gap-3">
									<img
										src={tool.icon_url}
										alt={`${tool.name} icon`}
										className="h-7 w-7 rounded-md object-contain"
										onError={(e) => (e.currentTarget.src = "/image.png")}
									/>
									<span className="font-medium text-white">{tool.name}</span>
								</div>
								<span>{tool.vendor}</span>
								<span>{tool.owner_department}</span>
								<span>{tool.category}</span>
								<span>{tool.active_users_count ?? 0}</span>
								<span>€{tool.monthly_cost ?? 0}</span>
								<span
									className={`w-max px-2 py-1 rounded-full text-xs font-semibold ${
										tool.status === "active"
											? "bg-green-500 text-white"
											: tool.status === "expiring"
												? "bg-orange-500 text-white"
												: "bg-red-500 text-white"
									}`}
								>
									{tool.status}
								</span>
								<span>{tool.updated_at}</span>
								<span>{tool.description}</span>
								<div className="relative justify-self-end">
									<button
										onClick={(e) => {
											e.stopPropagation()
											setOpenMenuId(openMenuId === tool.id ? null : tool.id)
										}}
										className="rounded-lg p-2 hover:bg-gray-800"
									>
										<MoreVertical className="h-4 w-4 text-gray-400" />
									</button>

									{/* Dropdown*/}
									{openMenuId === tool.id && (
										<div
											onClick={(e) => e.stopPropagation()}
											className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-700 bg-neutral-900 shadow-lg z-10"
										>
											<ul className="py-1 text-sm text-gray-200">
												<li className="px-3 py-2 hover:bg-gray-800 cursor-pointer">View details</li>
												<li className="px-3 py-2 hover:bg-gray-800 cursor-pointer">Edit</li>
												<li className="px-3 py-2 hover:bg-red-500/10 text-red-400 cursor-pointer">Enable / Disable</li>
											</ul>
										</div>
									)}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default Tools
