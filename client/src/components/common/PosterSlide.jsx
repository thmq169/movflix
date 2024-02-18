/* eslint-disable react/prop-types */
import { SwiperSlide } from "swiper/react"
import { Box } from "@mui/material"
import tmdbConfig from "../../api/configs/tmdbConfig"
import AutoSwiper from "./AutoSwiper"

const PosterSlide = ({ posters }) => {
    return (
        <AutoSwiper>
            {
                [...posters].splice(0, 10).map((poster, index) => (
                    <SwiperSlide key={index}>
                        <Box sx={{
                            paddingTop: "160%",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundImage: `url(${tmdbConfig.posterPath(poster.file_path)})`
                        }}>

                        </Box>
                    </SwiperSlide>
                ))
            }
        </AutoSwiper>
    )
}

export default PosterSlide