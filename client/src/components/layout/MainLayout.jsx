import { Outlet } from "react-router-dom"
import Box from '@mui/system/Box';
import { useDispatch, useSelector } from "react-redux";
import GlobalLoading from "../common/GlobalLoading";
import Footer from "../common/Footer";
import Topbar from "../common/Topbar";
import AuthModal from "../common/AuthModal";
import { userSelector } from "../../redux/selector";
import { useEffect } from "react";
import userApi from "../../api/modules/userApi";
import { setListFavorites, setUser } from "../../redux/features/userSlice";
import favoriteApi from "../../api/modules/favoriteApi";
import { toast } from "react-toastify";

const MainLayout = () => {
    const dispatch = useDispatch()

    const { user } = useSelector(userSelector)

    useEffect(() => {
        const authUser = async () => {
            const { response, error } = await userApi.getInfo()

            if (response) dispatch(setUser(response))
            if (error) dispatch(setUser(null))
        }

        authUser()
    }, [dispatch])

    useEffect(() => {
        const getFavoriteByUser = async () => {
            const { response, error } = await favoriteApi.getListFavorite()

            if (response) dispatch(setListFavorites(response))
            if (error) toast.error(error.message)
        }

        if (user) getFavoriteByUser()
        if (!user) dispatch(setListFavorites([]))
    }, [user, dispatch])

    return (
        <>
            <GlobalLoading />

            <AuthModal />

            <Box display="flex" minHeight="100vh">
                <Topbar />
                <Box
                    component="main"
                    flexGrow={1}
                    overflow="hidden"
                    minHeight="100vh"
                >
                    <Outlet />
                </Box>
            </Box>

            <Footer />
        </>
    )
}

export default MainLayout