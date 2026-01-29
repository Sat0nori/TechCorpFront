import { Bell, Settings, Sun, Zap } from "lucide-react"
import { useState } from "react"
import { Link, Outlet } from "react-router"

const NavBar = () => {
	const [open, setOpen] = useState(false)
	const [notifs, setNotifs] = useState(0)
	return (
		<div>
			<header className="w-full border-b border-gray-800 bg-black">
				<div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4">
					<div className="flex items-center gap-4">
						{/* Logo */}
						<div className="flex items-center gap-2">
							<div className="flex items-center justify-center h-8 w-8 rounded text-white bg-linear-to-br from-blue-500 to-violet-600">
								<Zap />
							</div>
							<span className="text-lg font-semibold text-white">TechCorp</span>
						</div>

						{/* Navigation */}
						<nav className="ml-6 flex items-center gap-4 text-white">
							<Link to="/" className="hidden sm:inline">
								{" "}
								Dashboard{" "}
							</Link>
							<Link to="/" className="sm:hidden font-bold">
								D
							</Link>
							<Link to="/tools" className="hidden sm:inline">
								Tools
							</Link>
							<Link to="/tools" className="sm:hidden font-bold">
								T
							</Link>
							<Link to="/analytics" className="hidden sm:inline">
								Analytics
							</Link>
							<Link to="/analytics" className="sm:hidden font-bold">
								A
							</Link>
							<Link to="/settings" className="hidden sm:inline">
								Settings
							</Link>
							<Link to="/settings" className="sm:hidden font-bold">
								S
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						{/* Search */}
						<input
							type="text"
							placeholder="Search tools...."
							className="hidden md:block rounded-lg border border-gray-700 bg-neutral-900 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
						/>

						{/* Icons */}
						<button className="rounded-lg p-2 hover:bg-gray-800">
							<Sun className="h-5 w-5 text-yellow-300" />
						</button>
						<button className="relative rounded-lg p-2 hover:bg-gray-800">
							<Bell className="h-5 w-5 text-gray-300" />
							<span
								onClick={() => setNotifs(notifs + 1)}
								className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
							>
								{notifs}
							</span>
						</button>
						<button className="rounded-lg p-2 hover:bg-gray-800">
							<Settings className="h-5 w-5 text-gray-300" />
						</button>

						{/* Avatar */}
						<div className="relative">
							<button onClick={() => setOpen(!open)} className="h-8 w-8 rounded-full ring-2 ring-gray-700 bg-white" />

							{/* Dropdown */}
							{open && (
								<div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-800 bg-neutral-900 shadow-lg">
									<ul className="py-1 text-sm text-gray-200">
										<li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">Profile</li>
										<li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">Settings</li>
										<li className="border-t border-gray-800 my-1" />
										<li className="px-4 py-2 hover:bg-red-500/10 text-red-400 cursor-pointer">Logout</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<div className="bg-neutral-950 pt-3">
				<Outlet />
			</div>
		</div>
	)
}

export default NavBar
