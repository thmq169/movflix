/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { userSelector } from "../redux/selector"
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"
import mediaApi from "../api/modules/mediaApi"
import ImageHeader from "../components/common/ImageHeader"
import tmdbConfig from "../api/configs/tmdbConfig"
import uiConfigs from "../configs/uiConfigs"
import CircularRate from "../components/common/CircularRate"
import Container from "../components/common/Container"
import CastSlide from "../components/common/CastSlide"
import { setAuthModalOpen } from "../redux/features/authSlice"
import favoriteApi from "../api/modules/favoriteApi"
import { addFavorite, removeFavorite } from "../redux/features/userSlice"
import MediaVideoSlide from "../components/common/MediaVideoSlide"
import BackdropSlide from "../components/common/BackdropSlide"
import PosterSlide from "../components/common/PosterSlide"
import RecommendSlide from "../components/common/RecommendSlide"
import MediaSlide from "../components/common/MediaSlide"
import MediaReview from "../components/common/MediaReview"

const MediaDetail = () => {
    const { mediaType, mediaId } = useParams()
    const dispatch = useDispatch()

    const { user, listFavorites } = useSelector(userSelector)

    const [media, setMedia] = useState()
    const [isFavorite, setIsFavorite] = useState(false)
    const [onRequest, setOnRequest] = useState(false)
    const [genres, setGenres] = useState([])

    const videoRef = useRef(null)

    useEffect(() => {
        const getMedia = async () => {
            dispatch(setGlobalLoading(true))
            const { response, error } = await mediaApi.getDetail({ mediaType, mediaId })
            dispatch(setGlobalLoading(false))

            if (response) {
                window.scrollTo(0, 0)
                setMedia(response)
                setIsFavorite(response.isFavorite)
                setGenres(response.genres.splice(0, 2))
            }

            if (error) toast.error(error.message)
        }

        getMedia()
    }, [mediaType, mediaId, dispatch])

    const addToFavorite = async () => {
        if (!user) return dispatch(setAuthModalOpen(true))

        if (onRequest) return

        if (isFavorite) {
            deleteFavorites()
            return
        }

        setOnRequest(true)

        const body = {
            mediaId: media.id,
            mediaTitle: media.title || media.name,
            mediaType: mediaType,
            mediaPoster: media.poster_path,
            mediaRate: media.vote_average
        }

        const { response, error } = await favoriteApi.addFavorite(body)

        setOnRequest(false)

        if (error) toast.error(error.message)

        if (response) {
            dispatch(addFavorite(response))
            setIsFavorite(true)
            toast.success("Add favorite success")
        }
    }

    const deleteFavorites = async () => {
        setOnRequest(true)
        const favorite = listFavorites.find(f => f.mediaId.toString() === media.id.toString())

        const { response, error } = await favoriteApi.removeFavorite({ favoriteId: favorite.id })

        setOnRequest(false)

        if (error) toast.error(error.message)

        if (response) {
            dispatch(removeFavorite(favorite))
            setIsFavorite(false)
            toast.success("Remove favorite success")
        }
    }

    return (
        media ? (
            <>
                <ImageHeader imagePath={tmdbConfig.backDropPath(media.backdrop_path || media.poster_path)} />
                <Box sx={{
                    color: "primary.contrastText",
                    ...uiConfigs.style.mainContent
                }}>
                    <Box sx={{
                        marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" }
                    }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: { md: "row", xs: "column" }
                        }}>
                            <Box sx={{
                                width: { xs: "70%", sm: "50%", md: "40%" },
                                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" }
                            }}>
                                <Box sx={{
                                    paddingTop: "140%",
                                    ...uiConfigs.style.backgroundImage(tmdbConfig.posterPath(media.poster_path || media.backdrop_path))
                                }} />
                            </Box>

                            <Box sx={{
                                width: { xs: "100%", md: "60%" },
                                color: "text.primary"
                            }}>
                                <Stack spacing={5}>
                                    <Typography
                                        variant="h4"
                                        fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                                        fontWeight="700"
                                        sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                                    >
                                        {
                                            `${media.title || media.name} ${mediaType === tmdbConfig.mediaType.movie ? media.release_date.split("-")[0] : media.first_air_date.split("-")[0]}`
                                        }
                                    </Typography>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CircularRate value={media.vote_average} />

                                        <Divider orientation="vertical" />

                                        {
                                            genres.map((genre, index) => (
                                                <Chip
                                                    key={index}
                                                    label={genre.name}
                                                    variant="filled"
                                                    color="primary"
                                                />
                                            ))
                                        }
                                    </Stack>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            ...uiConfigs.style.typoLines(5)
                                        }}>
                                        {media.overview}
                                    </Typography>

                                    <Stack direction="row" spacing={1}>
                                        <LoadingButton
                                            variant="text"
                                            sx={{
                                                width: "max-content",
                                                "& .MuiButton-starIcon": { marginRight: 0 }
                                            }}
                                            size="large"
                                            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                                            loadingPosition="start"
                                            loading={onRequest}
                                            onClick={addToFavorite}
                                        />

                                        <Button
                                            variant="contained"
                                            sx={{
                                                width: "max-content"
                                            }}
                                            size="large"
                                            startIcon={<PlayArrowIcon />}
                                            onClick={() => videoRef.current.scrollIntoView()}
                                        >
                                            watch now
                                        </Button>
                                    </Stack>

                                    <Container
                                        header="cast"
                                    >
                                        <CastSlide casts={media.credits.cast} />
                                    </Container>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>

                    <div ref={videoRef} style={{ paddingTop: "2rem" }}>
                        <Container header="Videos">
                            <MediaVideoSlide videos={[...media.videos.results].splice(0, 5)} />
                        </Container>
                    </div>

                    {media.images.backdrops.length > 0 && (
                        <Container header="backdrops">
                            <BackdropSlide backdrops={media.images.backdrops} />
                        </Container>
                    )}

                    {media.images.posters.length > 0 && (
                        <Container header="posters">
                            <PosterSlide posters={media.images.posters} />
                        </Container>
                    )}

                    <MediaReview reviews={media.reviews} media={media} mediaType={mediaType} />

                    <Container header="you may also like">
                        {
                            media.recommend.length > 0 && (
                                <RecommendSlide medias={media.recommend} mediaType={mediaType} />
                            )
                        }
                        {
                            media.recommend.length === 0 && (
                                <MediaSlide
                                    mediaType={mediaType}
                                    mediaCategory={tmdbConfig.mediaCategory.top_rated}
                                />
                            )
                        }
                    </Container>
                </Box>
            </>
        ) : null
    )
}

export default MediaDetail