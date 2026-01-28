export interface ToolInterface {
	id: number
	name: string // "Slack", "Figma", etc.
	description: string
	vendor: string
	category: string // "Development", "Design", etc.
	monthly_cost: number
	previous_month_cost: number
	owner_department: string
	status: "active" | "unused" | "expiring"
	website_url: string
	active_users_count: number
	icon_url: string
	created_at: string
	updated_at: string
}
