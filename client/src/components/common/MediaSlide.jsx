import { useEffect, useState } from "react"
import mediaApi from "../../api/modules/mediaApi"
import { toast } from "react-toastify"
import AutoSwiper from "./AutoSwiper"
import { SwiperSlide } from "swiper/react"
import MediaItem from "./MediaItem"

// eslint-disable-next-line react/prop-types
const MediaSlide = ({ mediaType, mediaCategory }) => {
    const [medias, setMedias] = useState([])

    useEffect(() => {
        const getMedias = async () => {
            const { response, error } = await mediaApi.getList({
                mediaType,
                mediaCategory,
                page: 1
            })

            if (response) setMedias(response.results)
            if (error) toast.error(error.message)
        }

        getMedias()

    }, [mediaType, mediaCategory])

    return (
        <AutoSwiper>
            {
                medias.map((media, index) => (
                    <SwiperSlide key={index}>
                        <MediaItem media={media} mediaType={mediaType} />
                    </SwiperSlide>
                ))
            }
        </AutoSwiper>
    )
}

export default MediaSlide