/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import personApi from "../../api/modules/personApi"
import tmdbConfig from "../../api/configs/tmdbConfig"
import { Button, Grid } from "@mui/material"
import MediaItem from "./MediaItem"

const PersonMediaGrid = ({ personId }) => {
    const [medias, setMedias] = useState([])
    const [filteredMedias, setFilteredMedias] = useState([])
    const [page, setPage] = useState(1)
    const skip = 8

    useEffect(() => {
        const getMedias = async () => {
            const { response, error } = await personApi.getMedias({ personId })

            if (error) toast.error(error.message)
            if (response) {
                const mediaSorted = response.cast.sort((a, b) => getReleaseDate(b) - getReleaseDate(a))
                setMedias([...mediaSorted])
                setFilteredMedias([...mediaSorted].splice(0, skip))
            }
        }

        getMedias()
    }, [personId])

    const getReleaseDate = (media) => {
        const date = media.media_type === tmdbConfig.mediaType.movie ? new Date(media.release_date) : new Date(media.first_air_date)

        return date.getTime()
    }

    const onLoadMore = () => {
        setFilteredMedias([...filteredMedias, ...[...medias].splice(page * skip, skip)])
        setPage(page + 1)
    }

    return (
        <>
            <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
                {
                    filteredMedias.map((media, index) => (
                        <Grid key={index} item xs={6} sm={4} md={3}>
                            <MediaItem media={media} mediaType={media.media_type} />
                        </Grid>
                    ))
                }
            </Grid>
            {
                filteredMedias.length < medias.length && (
                    <Button onClick={onLoadMore}>
                        load more
                    </Button>
                )
            }
        </>
    )
}

export default PersonMediaGrid