/* eslint-disable react/prop-types */
import { SwiperSlide } from "swiper/react"
import NavigationSwiper from "./NavigationSwiper"
import { Box } from "@mui/material"
import tmdbConfig from "../../api/configs/tmdbConfig"

const BackdropSlide = ({ backdrops }) => {
    return (
        <NavigationSwiper>
            {
                [...backdrops].splice(0, 10).map((backdrop, index) => (
                    <SwiperSlide key={index}>
                        <Box sx={{
                            paddingTop: "60%",
                            backgroundPosition: "top",
                            backgroundSize: "cover",
                            backgroundImage: `url(${tmdbConfig.backDropPath(backdrop.file_path)})`
                        }}>

                        </Box>
                    </SwiperSlide>
                ))
            }
        </NavigationSwiper>
    )
}

export default BackdropSlide