export interface UserToolInterface {
	user_id: number
	tool_id: number
	usage_frequency: "daily" | "weekly" | "monthly" | "rarely"
	last_used: string
	proficiency_level: "beginner" | "intermediate" | "advanced" | "expert"
}
