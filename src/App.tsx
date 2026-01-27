import { Route, Routes } from "react-router"
import NavBar from "./components/NavBar"
import Dashboard from "./pages/Dashboard"

function App() {
	return (
		<Routes>
			<Route element={<NavBar />}>
				<Route index element={<Dashboard />} />
			</Route>
		</Routes>
	)
}

export default App
