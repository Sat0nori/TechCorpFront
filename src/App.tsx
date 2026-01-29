import { Route, Routes } from "react-router"
import NavBar from "./components/NavBar"
import Dashboard from "./pages/Dashboard"
import Tools from "./pages/Tools"
import Analytics from "./pages/Analytics"

function App() {
	return (
		<Routes>
			<Route element={<NavBar />}>
				<Route index element={<Dashboard />} />
				<Route path="/tools" element={<Tools />} />
				<Route path="/analytics" element={<Analytics />} />
			</Route>
		</Routes>
	)
}

export default App
