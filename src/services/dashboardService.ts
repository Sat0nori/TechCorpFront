import axios, { type AxiosInstance } from "axios"
import type { AnalyticsInterface } from "../interfaces/AnalyticsInterface"
import type { ToolInterface } from "../interfaces/ToolInterface"
import type { DepartmentInterface } from "../interfaces/DepartmentInterface"

const api: AxiosInstance = axios.create({ baseURL: import.meta.env.VITE_URL })

export const dashboardService = {
	getAnalytics: async (): Promise<AnalyticsInterface> => {
		try {
			const { data } = await api.get("/analytics")
			return data
		} catch (error) {
			throw new Error("Erreur lors de la récupération des Analytics")
		}
	},

	getActiveTools: async (): Promise<ToolInterface[]> => {
		try {
			const { data } = await api.get("/tools?status=active")
			return data
		} catch (error) {
			throw new Error("Erreur lors de la récupération des Tools")
		}
	},

	getRecentTools: async (): Promise<ToolInterface[]> => {
		try {
			const { data } = await api.get("/tools?_sort=updated_at&_order=desc&_limit=8")
			return data
		} catch (error) {
			throw new Error("Erreur lors de la récupération des Tools")
		}
	},

	getDepartment: async (): Promise<DepartmentInterface[]> => {
		try {
			const { data } = await api.get("/departments")
			return data
		} catch (error) {
			throw new Error("Erreur lors de la récupération des departments")
		}
	},
}
