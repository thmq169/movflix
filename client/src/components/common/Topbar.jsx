import { useDispatch, useSelector } from "react-redux";
import { appStateSelector, themeModeSelector, userSelector } from "../../redux/selector";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, useScrollTrigger } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { cloneElement, useState } from "react";
import { themeModes } from "../../configs/themeConfigs";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import Logo from "./Logo";
import menuConfigs from "../../configs/menuConfigs";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { setAuthModalOpen } from "../../redux/features/authSlice";
import Sidebar from "./Sidebar";

const ScrollAppBar = ({ children, window }) => {
    const { themeMode } = useSelector(themeModeSelector);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
        target: window ? window() : undefined
    })
    return cloneElement(children, {
        sx: {
            color: trigger ? "text.primary" : themeMode === themeModes.dark ? "primary.cotrastText" : "text.primary",
            backgroundColor: trigger ? "background.paper" : themeMode === themeModes.dark ? "transparent" : "background.paper"
        }
    })
}

const Topbar = () => {
    const { user } = useSelector(userSelector);
    const { appState } = useSelector(appStateSelector);
    const { themeMode } = useSelector(themeModeSelector);
    const dispatch = useDispatch()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const onSwitchTheme = () => {
        const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark
        dispatch(setThemeMode(theme))
    }

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            <ScrollAppBar>
                <AppBar elevation={0} sx={{ zIndex: 9999 }}>
                    <Toolbar sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton
                                color="inherit"
                                sx={{ mr: 2, display: { md: "none" } }}
                                onClick={toggleSidebar}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: { xs: "inline-block", md: "none" } }}>
                                <Logo />
                            </Box>
                        </Stack>

                        <Box flexGrow={1} alignItems="center" display={{ xs: "none", md: "flex" }}>
                            <Box sx={{ marginRight: "30px" }}>
                                <Logo />
                            </Box>
                            {
                                menuConfigs.main.map((item, index) => (
                                    <Button
                                        key={index}
                                        sx={{
                                            color: appState.includes(item.state) ? "primary.contrasText" : "inherit",
                                            mr: 2
                                        }}
                                        component={Link}
                                        to={item.path}
                                        variant={appState.includes(item.state) ? "contained" : "text"}
                                    >
                                        {item.display}
                                    </Button>
                                ))
                            }
                            <IconButton
                                sx={{ color: "inherit" }}
                                onClick={onSwitchTheme}
                            >
                                {themeMode === themeModes.dark && <DarkModeOutlinedIcon />}
                                {themeMode === themeModes.light && <WbSunnyOutlinedIcon />}
                            </IconButton>
                        </Box>

                        <Stack
                            spacing={3}
                            direction="row"
                            alignItems="center"
                        >
                            {
                                !user && <Button
                                    variant="contained"
                                    onClick={() => dispatch(setAuthModalOpen(true))}
                                >
                                    sign in
                                </Button>
                            }
                        </Stack>

                        {user && <UserMenu />}

                    </Toolbar>
                </AppBar>
            </ScrollAppBar>
        </>
    )
}

export default Topbar