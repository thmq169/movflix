import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selector";
import { useState } from "react";
import { ListItemButton, ListItemIcon, ListItemText, Menu, Typography } from "@mui/material";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import menuConfigs from "../../configs/menuConfigs";
import { Link } from "react-router-dom";
import { setUser } from "../../redux/features/userSlice";


const UserMenu = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(userSelector);

    const [anchorEl, setAnchorEl] = useState(null)

    const toggleMenu = (e) => setAnchorEl(e.currentTarget)

    return (
        <>
            {
                user && (
                    <>
                        <Typography
                            variant="h6"
                            sx={{ cursor: "pointer", userSelect: 'none' }}
                            onClick={toggleMenu}
                        >
                            {user.displayName}
                        </Typography>
                        <Menu
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{ sx: { padding: 0 } }}
                        >
                            {
                                menuConfigs.user.map((item, index) => (
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        key={index}
                                        onClick={() => setAnchorEl(null)}
                                    >
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
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
                            <ListItemButton
                                sx={{
                                    borderRadius: "10px"
                                }}
                                onClick={() => dispatch(setUser(null))}
                            >
                                <ListItemIcon>
                                    <LoginOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography
                                            textTransform="uppercase"
                                        >
                                            sign out
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </Menu>
                    </>
                )
            }
        </>
    )
}

export default UserMenu