/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import reviewApi from "../api/modules/reviewApi"
import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { routesGen } from "../routers/router"
import uiConfigs from "../configs/uiConfigs"
import tmdbConfig from "../api/configs/tmdbConfig"
import dayjs from "dayjs"
import { LoadingButton } from "@mui/lab"
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from "react-redux"
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"
import Container from "../components/common/Container"

const ReviewItem = ({ review, onRemoved }) => {
    const [onRequest, setOnRequest] = useState(false)

    const onRemove = async () => {
        if (onRequest) return
        setOnRequest(true)
        const { response, error } = await reviewApi.remove({ reviewId: review.id })
        setOnRequest(false)

        if (error) toast.error(error.message)

        if (response) {
            toast.success("Remove review success")
            onRemoved(review.id)
        }
    }

    return (
        <>
            <Box sx={{
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                padding: 1,
                opacity: onRequest ? 0.6 : 1,
                "&:hover": {
                    backgroundColor: "background.paper"
                }
            }}>
                <Box sx={{ width: { xs: 0, md: "10%" } }}>
                    <Link
                        to={routesGen.mediaDetail(review.mediaType, review.mediaId)}
                        style={{ color: "unset", textDecoration: "none" }}
                    >
                        <Box
                            sx={{
                                paddingTop: "160%",
                                ...uiConfigs.style.backgroundImage(tmdbConfig.posterPath(review.mediaPoster))
                            }}
                        />
                    </Link>

                </Box>
                <Box sx={{
                    width: { xs: "100%", md: "80%" },
                    padding: { xs: 0, md: "0 2rem" }
                }}>
                    <Stack spacing={1}>
                        <Link
                            to={routesGen.mediaDetail(review.mediaType, review.mediaId)}
                            style={{ color: "unset", textDecoration: "none" }}
                        >
                            <Typography
                                variant="h6"
                                sxx={{ ...uiConfigs.style.typoLines(1, "left") }}
                            >
                                {review.mediaTitle}
                            </Typography>
                        </Link>
                        <Typography variant="caption">
                            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                        </Typography>
                        <Typography>
                            {review.content}
                        </Typography>
                    </Stack>
                </Box>
                <LoadingButton
                    fullWidth
                    variant="contained"
                    sx={{
                        position: { xs: "relative", md: "absolute" },
                        marginTop: { xs: 2, md: 0 },
                        right: { xs: 0, md: "10px" },
                        width: "max-content"
                    }}
                    startIcon={<DeleteIcon />}
                    loadingPosition="start"
                    loading={onRequest}
                    onClick={onRemove}
                >
                    remove
                </LoadingButton>
            </Box>
        </>
    )
}

const ReviewList = () => {
    const [reviews, setReviews] = useState([])
    const [filteredReviews, setFilteredReviews] = useState([])
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const dispatch = useDispatch()
    const skip = 8

    useEffect(() => {
        const getReviews = async () => {
            dispatch(setGlobalLoading(true))
            const { response, error } = await reviewApi.getListReview()
            dispatch(setGlobalLoading(false))

            if (error) toast.error(error.message)
            if (response) {

                setCount(response.length)
                setReviews([...response])
                setFilteredReviews([...response].splice(0, skip))
            }

        }
        getReviews()
    }, [dispatch])

    const onLoadMore = () => {
        setFilteredReviews([...filteredReviews, ...[...reviews].splice(page * skip, skip)])
        setPage(page + 1)
    }

    const onRemoved = (id) => {
        const newReviews = [...reviews].filter(m => m.id !== id)
        setReviews(newReviews)
        setFilteredReviews([...newReviews].splice(0, page * skip))
        setCount(count - 1)
    }
    return (
        <Box sx={{ ...uiConfigs.style.mainContent }}>
            <Container header={`Your reviews (${count})`}>
                <Stack spacing={1}>
                    {
                        filteredReviews.map(item => (
                            <Box key={item.id}>
                                <ReviewItem review={item} onRemoved={onRemoved} />
                                <Divider
                                    sx={{
                                        display: { xs: "block", md: "none" }
                                    }}
                                />
                            </Box>
                        ))
                    }
                    {
                        filteredReviews.length < reviews.length && (
                            <Button onClick={onLoadMore}>load more</Button>
                        )
                    }
                </Stack>
            </Container>
        </Box>
    )
}

export default ReviewList