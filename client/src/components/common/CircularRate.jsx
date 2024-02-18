import { Box, CircularProgress, Typography } from "@mui/material"

// eslint-disable-next-line react/prop-types
const CircularRate = ({ value }) => {
    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-block",
                width: "max-content"
            }}
        >
            <CircularProgress
                variant="determinate"
                value={value * 10}
                color="success"
            />

            <Box
                sx={{
                    inset: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    fontWeight="700"
                    marginTop="-5px"
                >
                    {Math.floor(value * 10) / 10}
                </Typography>
            </Box>
        </Box>
    )
}

export default CircularRate