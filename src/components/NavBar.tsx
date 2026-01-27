import { Bell, Settings, Sun, Zap } from "lucide-react"
import { Link, Outlet } from "react-router"

const NavBar = () => {
	return (
		<div>
			<header className="w-full border-b border-gray-800 bg-black">
				<div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4">
					<div className="flex items-center gap-4">
						{/* Logo */}
						<div className="flex items-center gap-2">
							<div className="flex items-center justify-center h-8 w-8 rounded text-white bg-gradient-to-br from-blue-500 to-violet-600">
								<Zap />
							</div>
							<span className="text-lg font-semibold text-white">TechCorp</span>
						</div>

						{/* Navigation */}
						<nav className="ml-6 flex items-center gap-4 text-white">
							<Link to="/">Dashboard</Link>
							<Link to="/tools">Tools</Link>
							<Link to="/analytics">Analytics</Link>
							<Link to="/settings">Settings</Link>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						{/* Search */}
						<input
							type="text"
							placeholder="Recherche"
							className="hidden md:block rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
						/>

						{/* Icons */}
						<button className="rounded-lg p-2 hover:bg-gray-800">
							<Sun className="h-5 w-5 text-yellow-300" />
						</button>
						<button className="rounded-lg p-2 hover:bg-gray-800">
							<Bell className="h-5 w-5 text-gray-300" />
						</button>
						<button className="rounded-lg p-2 hover:bg-gray-800">
							<Settings className="h-5 w-5 text-gray-300" />
						</button>

						{/* Avatar */}
						<div className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-700 bg-white" />
					</div>
				</div>
			</header>

			<Outlet />
		</div>
	)
}

export default NavBar
