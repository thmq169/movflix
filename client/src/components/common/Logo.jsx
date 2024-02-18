import { Typography, useTheme } from '@mui/material'

const Logo = () => {
    const themeMode = useTheme();
    return (
        <Typography fontWeight="700" fontSize="1.7rem">
            Mov<span style={{ color: themeMode.palette.primary.main }}>Flix</span>
        </Typography>
    )
}

export default Logo