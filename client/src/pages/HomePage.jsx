import { Box } from "@mui/material"
import tmdbConfig from "../api/configs/tmdbConfig"
import HeroSlide from "../components/common/HeroSlide"
import uiConfigs from "../configs/uiConfigs"
import Container from "../components/common/Container"
import MediaSlide from "../components/common/MediaSlide"

const HomePage = () => {
    return (
        <>
            <HeroSlide
                mediaType={tmdbConfig.mediaType.movie}
                mediaCategory={tmdbConfig.mediaCategory.popular}
            />

            <Box
                marginTop="-4rem"
                sx={{
                    ...uiConfigs.style.mainContent
                }}
            >
                <Container header="popular movies">
                    <MediaSlide
                        mediaType={tmdbConfig.mediaType.movie}
                        mediaCategory={tmdbConfig.mediaCategory.popular}
                    />
                </Container>

                <Container header="popular series">
                    <MediaSlide
                        mediaType={tmdbConfig.mediaType.tv}
                        mediaCategory={tmdbConfig.mediaCategory.popular}
                    />
                </Container>

                <Container header="top rated movies">
                    <MediaSlide
                        mediaType={tmdbConfig.mediaType.movie}
                        mediaCategory={tmdbConfig.mediaCategory.top_rated}
                    />
                </Container>

                <Container header="top rated series">
                    <MediaSlide
                        mediaType={tmdbConfig.mediaType.tv}
                        mediaCategory={tmdbConfig.mediaCategory.top_rated}
                    />
                </Container>
            </Box>
        </>
    )
}

export default HomePage