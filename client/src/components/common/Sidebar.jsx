import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Logo from "./Logo";
import menuConfigs from "../../configs/menuConfigs";
import uiConfigs from "../../configs/uiConfigs";
import { themeModes } from "../../configs/themeConfigs";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import { appStateSelector, themeModeSelector, userSelector } from "../../redux/selector";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ open, toggleSidebar }) => {
    const { user } = useSelector(userSelector);
    const { appState } = useSelector(appStateSelector);
    const { themeMode } = useSelector(themeModeSelector);
    const dispatch = useDispatch()

    const sidebarWidth = uiConfigs.size.sidebarWidth

    const onSwitchTheme = () => {
        const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark
        dispatch(setThemeMode(theme))
    }

    const drawer = (
        <>
            <Toolbar sx={{ paddingY: "20px", color: "text.primary" }}>
                <Stack width="100%" direction="row" justifyContent="center">
                    <Logo />
                </Stack>
            </Toolbar>
            <List sx={{ paddingX: "30px" }}>
                <Typography variant="h6" marginBottom="20px">
                    MENU
                </Typography>
                {
                    menuConfigs.main.map((item, index) => (
                        <ListItemButton
                            key={index}
                            sx={{
                                borderRadius: "10px",
                                marginY: 1,
                                backgroundColor: appState.includes(item.state) ? "primary.main" : "unset"
                            }}
                            component={Link}
                            to={item.path}
                            onClick={() => toggleSidebar(false)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography
                                        textTransform="uppercase"
                                    >
                                        {item.display}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    ))
                }

                {
                    user && (
                        <>
                            <Typography variant="h6" marginBottom="20px">
                                PERSONAL
                            </Typography>
                            {
                                menuConfigs.user.map((item, index) => (
                                    <ListItemButton
                                        key={index}
                                        sx={{
                                            borderRadius: "10px",
                                            marginY: 1,
                                            backgroundColor: appState.includes(item.state) ? "primary.main" : "unset"
                                        }}
                                        component={Link}
                                        to={item.path}
                                        onClick={() => toggleSidebar(false)}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    textTransform="uppercase"
                                                >
                                                    {item.display}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                ))
                            }
                        </>
                    )
                }

                <Typography variant="h6" marginBottom="20px">THEME</Typography>
                <ListItemButton onClick={onSwitchTheme}>
                    <ListItemIcon >
                        {themeMode === themeModes.dark && <DarkModeOutlinedIcon />}
                        {themeMode === themeModes.light && <WbSunnyOutlinedIcon />}
                    </ListItemIcon>
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                textTransform="uppercase"
                            >
                                {themeMode === themeModes.dark ? "dark mode" : "light mode"}
                            </Typography>
                        }
                    />
                </ListItemButton>
            </List>
        </>
    )

    return (
        <Drawer
            open={open}
            onClose={() => toggleSidebar(false)}
            sx={{
                "& .MuiDrawer-Paper": {
                    boxSizing: "border-box",
                    width: sidebarWidth,
                    borderRight: '0px'
                }
            }}
        >
            {drawer}
        </Drawer>
    )
}

export default Sidebar