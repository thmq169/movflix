import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selector"
import { setAuthModalOpen } from "../../redux/features/authSlice";

// eslint-disable-next-line react/prop-types
const ProtectedPage = ({ children }) => {
    const dispatch = useDispatch();

    const { user } = useSelector(userSelector);

    useEffect(() => {
        dispatch(setAuthModalOpen(!user));
    }, [user, dispatch]);

    return (
        user ? children : null
    )
}

export default ProtectedPage