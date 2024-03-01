import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"
import Navigation from "./navigation"
import { Box, AppBar, Toolbar, IconButton, Drawer, Button, Avatar, Menu, MenuItem, BottomNavigation, Chip, Autocomplete, AutocompleteRenderInputParams, TextField, InputAdornment, FormControl, Grid } from "@mui/material";
import { AccountCircle, Menu as MenuIcon, Search, Tag } from '@mui/icons-material'
import TopBar from "./topBar";
import { useEffect, useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout, set_screen_size } from "../../store/auth";
import ProfilePicture from "../profile/picture";
import { Channel, User } from "../../utils/types_interfaces";
import BottomNav from "./bottomNavigation";
import logo from '../../assets/images/Floandroll.png'
import { getChannelsByChar } from "../../utils/forum-utils";

const drawerWidth = 250;

interface ChannelOptions {
    label: string,
    value: string,
    fullWidth: boolean
}

const MainLayout = () => {
    const {pathname} = useLocation()
    const { innerWidth } = window
    const [showDrawer, setShowDrawer] = useState(false)
    const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const [screenSize, setScreenSize] = useState('lg')
    const [openLeftDrawer, setOpenLeftDrawer] = useState(true)
    const [channelList, setChannelList] = useState<Array<ChannelOptions>>([])
    const [channel, setChannel] = useState('')
    const logged_id = useSelector((state: RootState) => {return state.auth.is_logged_in})
    const profile = useSelector((state: RootState) => state.auth.profile)
    const user = useSelector((state: RootState) => state.auth.user) as User
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(function () {
        console.log(pathname, ' pathname')
        setShowDrawer(pathname === '/' || pathname.includes('posts'))
    }, [pathname])

    useEffect(function() {
        let size = 'lg'
        if (innerWidth >= 1440) {
            size = 'lg'
        } else if (innerWidth >= 835 && innerWidth < 1440) {
            size = 'md'
        } else if (innerWidth < 835) {
            size = 'sm'
        }
        setScreenSize(size)
        dispatch(set_screen_size(size))
        if (size !== 'lg') {
            setOpenLeftDrawer(false)
        }
    }, [innerWidth])

    useEffect(() => {
        findChannel()
    }, [channel])

    const navigateTo = (nav: string) => {
        return navigate(nav)
    }
    const logout_user = () => {
        dispatch(logout())
        navigate('/')
    }

    const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget)
        setProfileMenuOpen(true)
    }

    const closeProfileMenu = () => {
        setProfileMenuOpen(false)
    }

    const findChannel = async () => {
        console.log('looking for channel')
        const list = await getChannelsByChar(channel) as Channel[]
        if (Array.isArray(list)) {
            setChannelList(list.map((l) => {return {label: l.category, value: l.slug, fullWidth: true}}))
        } else {
            setChannelList([])
        }
    }

    const selectChannel = (event: any, nav: boolean) => {
        try {
            if(!event.target) return
            const {value} = event.target
            

            setChannel(value)
            if (nav) {
                let new_value = channelList.filter(c => c.label === value)[0]['value']
                goToChannel(new_value as string)
            }
        } catch (e) {
            return
        }
        
    }

    const goToChannel = (channel_slug: string) => {
        return navigateTo(`/posts/${channel_slug}`)
    }
    return (
        <>
        <Box className={"box-container " + screenSize}>
            <AppBar position='fixed'>
                <Toolbar>
                    {screenSize !== 'lg' && 
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setOpenLeftDrawer(!openLeftDrawer)}>
                        <img src={logo} alt="logo to home" className="home-logo" />
                        <Chip label="Beta v0.1" variant="outlined" color="navBtn" />
                    </IconButton> ||
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} >
                    {/* <Avatar src={logo} /> */}
                        <img src={logo} alt="logo to home" className="home-logo" />
                        <Chip label="Beta v0.1" variant="outlined" color="navBtn" />
                    </IconButton>}
                
                    {screenSize === 'lg' && <TopBar />}
                    <Grid container spacing={2} alignItems={'center'} justifyItems={'shrink'} sx={{maxWidth: 400}}>
                        <Grid item xs={1} alignSelf={'end'}><Search/></Grid>
                        <Grid item xs={10}>
                            <Autocomplete
                                disablePortal
                                options={channelList.map(c => c.label)}
                                fullWidth={true}
                                autoComplete
                                size="small"
                                onSelect={(e) => {selectChannel(e, true)}}
                                renderInput={(params: AutocompleteRenderInputParams) => {return (
                                <TextField
                                    type="input"
                                    name="channel"
                                    variant="standard"
                                    value={channel}
                                    color="navBtn"
                                    focused
                                    {...params}
                                    onChange={e => {selectChannel(e, false)}}>
                                </TextField>)}} />
                        </Grid>
                    </Grid>
                    {logged_id && 
                    <>
                        <Button onClick={handleProfileClick} color='navBtn'> 
                                <Avatar sx={{margin: '0 5px', bgcolor: '#333'}} src={profile?.image ? profile.image : ''}>
                                    {!profile?.image && <AccountCircle />}
                                </Avatar>
                                
                            {screenSize === 'lg' && user?.username}
                        </Button>
                        <Menu anchorEl={profileMenuAnchor}
                            open={profileMenuOpen}
                            onClose={closeProfileMenu}>
                                <MenuItem onClick={() => {navigateTo(`/profile/${user?.username}`)}}>View Profile</MenuItem>
                                <MenuItem onClick={() => {navigateTo(`/profile/edit/${user?.username}`)}}>Edit Profile</MenuItem>
                                <MenuItem onClick={logout_user}>Logout</MenuItem>
                        </Menu>
                        {/* <Button color="inherit" onClick={logout_user}>Logout</Button>  */}
                    </> ||
                    <>
                        <Button color="inherit" onClick={() => {navigateTo('/login')}}>Login</Button>
                        <Button color="inherit" onClick={() => {navigateTo('/register')}}>Register</Button>
                    </>}
                </Toolbar>
            </AppBar>
            {screenSize === 'lg' && <Navigation /> || <>{openLeftDrawer && 
            <Drawer open={openLeftDrawer} onClose={() => setOpenLeftDrawer(!openLeftDrawer)}>
                <Navigation />
            </Drawer>}</>}
            <Box className="box-item-3 main-content" id="main-content">
                <Outlet />
            </Box>
            {screenSize !== 'lg' &&
                <BottomNav />
            }
        </Box>
            
        </>
    )
}

export default MainLayout;