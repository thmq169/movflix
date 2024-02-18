/* eslint-disable react/prop-types */
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { LoadingButton } from "@mui/lab"
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import TextAvatar from "./TextAvatar"
import Container from "./Container"
import reviewApi from "../../api/modules/reviewApi"
import { userSelector } from "../../redux/selector"

const ReviewItem = ({ review, onRemoved }) => {
    const { user } = useSelector(userSelector)
    const [onRequest, setOnRequest] = useState(false)

    const onRemove = async () => {
        if (onRequest) return

        setOnRequest(true)

        const { response, error } = await reviewApi.remove({ reviewId: review.id })

        if (error) { toast.error(error.message) }
        if (response) onRemoved(review.id)
    }
    return (
        <Box sx={{
            padding: 2,
            borderRadius: "5px",
            position: "relative",
            opacity: onRequest ? 0.6 : 1,
            "&:hover": {
                backgroundColor: "background.paper"
            }
        }}>
            <Stack direction="row" spacing={2}>
                <TextAvatar text={review.user.displayName} />
                <Stack spacing={2} flexGrow={1}>
                    <Stack spacing={1}>
                        <Typography variant="h6" fontWeight="700">
                            {review.user.displayName}
                        </Typography>
                        <Typography variant="caption">
                            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                        </Typography>
                    </Stack>
                    <Typography variant="body1" textAlign="justify">
                        {review.content}
                    </Typography>

                    {user && user.id === review.user.id && (
                        <LoadingButton
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            loadingPosition="start"
                            loading={onRequest}
                            onClick={onRemove}
                            sx={{
                                position: { xs: "relative", md: "absolute" },
                                right: { xs: 0, md: "10px" },
                                marginTop: { xs: 2, md: 0 },
                                width: "max-content"
                            }}
                        >
                            remove
                        </LoadingButton>
                    )}
                </Stack>
            </Stack>
        </Box>
    )
}

const MediaReview = ({ reviews, media, mediaType }) => {
    const { user } = useSelector(userSelector)
    const [listReviews, setListReviews] = useState([])
    const [filterReviews, setFilterReviews] = useState([])
    const [page, setPage] = useState(1)
    const [onRequest, setOnRequest] = useState(false)
    const [content, setContent] = useState("")
    const [reviewCount, setReviewCount] = useState(0)

    const skip = 4

    useEffect(() => {
        setListReviews([...reviews])
        setFilterReviews([...reviews].splice(0, skip))
        setReviewCount(reviews.length)
    }, [reviews])

    const onAddReview = async () => {
        if (onRequest) return;
        setOnRequest(true);

        const body = {
            content,
            mediaId: media.id,
            mediaType,
            mediaTitle: media.title || media.name,
            mediaPoster: media.poster_path
        };

        const { response, err } = await reviewApi.add(body);

        setOnRequest(false);

        if (err) toast.error(err.message);
        if (response) {
            toast.success("Add review success");
            setFilterReviews([...filterReviews, response]);
            setReviewCount(reviewCount + 1);
            setContent("");
        }
    };

    const onLoadMore = () => {
        setFilterReviews([...filterReviews, ...[...listReviews].splice(page * skip, skip)]);
        setPage(page + 1);
    };

    const onRemoved = (id) => {
        if (listReviews.findIndex(e => e.id === id) !== -1) {
            const newListReviews = [...listReviews].filter(e => e.id !== id);
            setListReviews(newListReviews);
            setFilterReviews([...newListReviews].splice(0, page * skip));
        } else {
            setFilterReviews([...filterReviews].filter(e => e.id !== id));
        }

        setReviewCount(reviewCount - 1);

        toast.success("Remove review success");
    };

    return (
        <>
            <Container header={`reviews (${reviewCount})`}>
                <Stack spacing={4} marginBottom={2}>
                    {
                        filterReviews.map(item => (
                            item.user ?
                                <Box key={item.id}>
                                    <ReviewItem review={item} onRemoved={onRemoved} />
                                    <Divider sx={{ display: { xs: "block", md: "none" } }} />
                                </Box> : null
                        ))
                    }
                    {
                        filterReviews.length < listReviews.length && (
                            <Button onClick={onLoadMore}>
                                load more
                            </Button>
                        )
                    }
                </Stack>
                {
                    user && (
                        <>
                            <Divider />
                            <Stack direction="row" spacing={2}>
                                <TextAvatar text={user.displayName} />
                                <Stack spacing={2} flexGrow={1}>
                                    <Typography variant="h6" fontWeight="700">
                                        {user.displayName}
                                    </Typography>
                                    <TextField
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        multiline
                                        rows={4}
                                        placeholder="Write your review"
                                        variant="outlined"
                                    />
                                    <LoadingButton
                                        variant="contained"
                                        size="large"
                                        sx={{ width: "max-content" }}
                                        startIcon={<SendOutlinedIcon />}
                                        loadingPosition="start"
                                        loading={onRequest}
                                        onClick={onAddReview}
                                    >
                                        post
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </>
                    )
                }
            </Container>
        </>
    )

}
export default MediaReview