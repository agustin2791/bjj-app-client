import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type nav_links = {
    label: string,
    path: string,
    contains: string
}

const links: nav_links[] = [
    {label: 'Posts', path: '/', contains: 'post'},
    {label: 'Academies', path: '/academy', contains: 'academy'},
    {label: 'About', path: '/about', contains: 'about'}
    // {label: 'Tournaments', path: '/tournaments', contains: 'tournaments'},
    // {label: 'Events', path: '/events', contains: 'events'}
]
const BottomNav = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [navs, setNavs] = useState<nav_links[]>(links)

    const navigateTo = (path: string) => {
        console.log('navigating to:', path)
        return navigate(path)
    }
    return (
        <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation showLabels>
                {navs.map((n: nav_links) => {return (
                    <BottomNavigationAction key={n.label} label={n.label} onClick={() => navigateTo(n.path)} />
                )})}
            </BottomNavigation>
        </Paper>
    )
}

export default BottomNav