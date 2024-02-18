/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setAppState } from "../redux/features/appStateSlice"
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"
import mediaApi from "../api/modules/mediaApi"
import { toast } from "react-toastify"
import HeroSlide from "../components/common/HeroSlide"
import { Box, Button, Stack, Typography } from "@mui/material"
import uiConfigs from "../configs/uiConfigs"
import tmdbConfig from "../api/configs/tmdbConfig"
import MediaGrid from "../components/common/MediaGrid"
import { LoadingButton } from "@mui/lab"

const MediaList = () => {
    const { mediaType } = useParams()

    const [medias, setMedias] = useState([])
    const [mediaLoading, setMediaLoading] = useState(false)
    const [currentCategory, setCurrentCategory] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const dispatch = useDispatch()

    const mediaCategories = useMemo(() => ["popular", "top_rated"], [])
    const categories = ["popular", "top rated"]

    useEffect(() => {
        dispatch(setAppState(mediaType))
        window.scrollTo(0, 0)
    }, [mediaType, dispatch])

    useEffect(() => {
        const getMedias = async () => {
            if (currentPage === 1) dispatch(setGlobalLoading(true))
            setMediaLoading(true)

            const { response, error } = await mediaApi.getList({
                mediaType,
                mediaCategory: mediaCategories[currentCategory],
                page: currentPage
            })

            setGlobalLoading(false)
            setMediaLoading(false)

            if (error) toast.error(error.message)
            if (response) {
                if (currentPage !== 1) setMedias(m => [...m, ...response.results])
                else setMedias([...response.results])
            }


        }
        getMedias()
    }, [
        mediaType,
        currentPage,
        currentCategory,
        mediaCategories,
        dispatch
    ])

    const onCategoryChange = (categoryIndex) => {
        if (currentCategory === categoryIndex) return

        setMedias([])
        setCurrentPage(1)
        setCurrentCategory(categoryIndex)
    }

    const onLoadMore = () => setCurrentPage(currentPage + 1)

    return (
        <>
            <HeroSlide mediaType={mediaType} mediaCategory={mediaCategories[currentCategory]} />

            <Box sx={{ ...uiConfigs.style.mainContent }}>
                <Stack marginBottom={4} spacing={2} direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between">
                    <Typography fontWeight="700" variant="h5">
                        {mediaType === tmdbConfig.mediaType.movie ? "Movies" : "TV Series"}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        {categories.map((category, index) => (
                            <Button
                                key={index}
                                size="large"
                                variant={currentCategory === index ? "contained" : "text"}
                                sx={{
                                    color: currentCategory === index ? "primary.contrastText" : "text.primary"
                                }}
                                onClick={() => onCategoryChange(index)}
                            >
                                {category}
                            </Button>
                        ))}
                    </Stack>

                </Stack>
                <MediaGrid
                    medias={medias}
                    mediaType={mediaType}
                />

                <LoadingButton
                    sx={{ marginTop: 8 }}
                    fullWidth
                    color="primary"
                    loading={mediaLoading}
                    onClick={onLoadMore}
                >
                    load more
                </LoadingButton>
            </Box>

        </>
    )
}

export default MediaList