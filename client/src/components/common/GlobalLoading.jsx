import { useSelector } from "react-redux";
import { globalLoadingSelector } from "../../redux/selector"
import { useEffect, useState } from "react";
import { Toolbar, Paper, LinearProgress, Box } from "@mui/material";
import Logo from "./Logo";

const GlobalLoading = () => {
    const { globalLoading } = useSelector(globalLoadingSelector);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (globalLoading) {
            setIsLoading(true);
        }
        else {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [globalLoading]);

    return (
        <>
            <Paper
                sx={{
                    opacity: isLoading ? 1 : 0,
                    position: "fixed",
                    pointerEvents: "none",
                    transition: "all .3s ease",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 99999,
                }}
            >
                <Toolbar />
                <LinearProgress />
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    <Logo />
                </Box>
            </Paper>
        </>
    )
}

export default GlobalLoading