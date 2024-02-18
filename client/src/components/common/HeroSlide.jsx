/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Box, Button, Chip, Divider, Stack, Typography, useTheme } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import mediaApi from "../../api/modules/mediaApi"
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice"
import genreApi from "../../api/modules/genreApi"
import uiConfigs from "../../configs/uiConfigs"
import tmdbConfig from "../../api/configs/tmdbConfig";
import CircularRate from "./CircularRate";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { routesGen } from "../../routers/router";

// eslint-disable-next-line react/prop-types
const HeroSlide = ({ mediaType, mediaCategory }) => {
    const dispatch = useDispatch()
    const theme = useTheme()

    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])

    useEffect(() => {
        const getMedias = async () => {
            const { response, error } = await mediaApi.getList({
                mediaType,
                mediaCategory,
                page: 1
            })

            if (response) {
                setMovies(response.results)
            }
            if (error) toast.error(error.message)

            dispatch(setGlobalLoading(false))
        }

        const getGenres = async () => {
            dispatch(setGlobalLoading(true))
            const { response, error } = await genreApi.getList({ mediaType })

            if (response) {
                setGenres(response.genres)
                getMedias()
            }
            if (error) {
                toast.error(error.message)
                setGlobalLoading(false)
            }
        }

        getGenres()
    }, [mediaType, mediaCategory, dispatch])

    return (
        <Box sx={{
            position: 'relative',
            color: "primary.contrastText",
            "&::before": {
                content: '""',
                width: '100%',
                height: '30%',
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 2,
                pointerEvents: 'none',
                ...uiConfigs.style.gradientBgImage[theme.palette.mode]
            }
        }}
        >
            <Swiper
                grabCursor={true}
                loop={true}
                // modules={[Autoplay]}
                // autoplay={{
                //     delay: 3000,
                //     disableOnInteraction: false
                // }}
                style={{ width: '100%', height: "max-content" }}
            >
                {
                    movies.map((movie, index) => (
                        <SwiperSlide key={index}>
                            <Box sx={{
                                paddingTop: {
                                    xs: "130%",
                                    sm: "80%",
                                    md: "60%",
                                    lg: "45%"
                                },
                                backgroundPosition: "top",
                                backgroundSize: "cover",
                                backgroundImage: `url(${tmdbConfig.backDropPath(movie.backdrop_path || movie.poster_path)})`
                            }}
                            />
                            <Box sx={{
                                width: "100%",
                                height: "100%",
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                ...uiConfigs.style.horizontalGradientBgImage[theme.palette.mode]
                            }}
                            />
                            <Box sx={{
                                width: "100%",
                                height: "100%",
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                paddingX: { sm: "10px", md: "5rem", lg: "10rem" }
                            }}
                            >
                                <Box sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingX: "30px",
                                    color: "text.primary",
                                    width: { sm: "unset", md: "30%", lg: "40%" }
                                }}
                                >
                                    <Stack spacing={4} direction="column" >
                                        <Typography
                                            variant="h4"
                                            fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                                            fontWeight="700"
                                            sx={{
                                                ...uiConfigs.style.typoLines(2, "left")
                                            }}
                                        >
                                            {movie.title || movie.name}</Typography>

                                        <Stack spacing={1} direction="row" alignItems="center">
                                            <CircularRate value={movie.vote_average} />

                                            <Divider orientation="vertical" />

                                            {
                                                [...movie.genre_ids].splice(0, 2).map((genreId, index) => (
                                                    <Chip
                                                        variant="filled"
                                                        color="primary"
                                                        key={index}
                                                        label={genres.find(e => e.id === genreId) && genres.find(e => e.id === genreId).name}
                                                    />
                                                ))
                                            }
                                        </Stack>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                ...uiConfigs.style.typoLines(3)
                                            }}
                                        >
                                            {movie.overview}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PlayArrowIcon />}
                                            component={Link}
                                            to={routesGen.mediaDetail(mediaType, movie.id)}
                                            sx={{ width: "max-content" }}
                                        >
                                            watch now
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </Box>
    )
}

export default HeroSlide