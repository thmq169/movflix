import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import userApi from "../api/modules/userApi";
import { toast } from "react-toastify";
import { setUser } from "../redux/features/userSlice";
import { setAuthModalOpen } from "../redux/features/authSlice";
import { Box, Stack, TextField } from "@mui/material";
import uiConfigs from "../configs/uiConfigs"
import Container from "../components/common/Container";
import { LoadingButton } from "@mui/lab";

const PasswordUpdate = () => {
    const [onRequest, setOnRequest] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const form = useFormik({
        initialValues: {
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().min(8, 'password minimum 8 characters').required("password is required"),
            newPassword: Yup.string().min(8, 'new password minimum 8 characters').required("new password is required"),
            confirmNewPassword: Yup.string().oneOf([Yup.ref("newPassword")], "confirm password does not match").min(8, 'confirm password minimum 8 characters').required("confirm password is required"),
        }),
        onSubmit: async values => onUpdate(values)
    })

    const onUpdate = async (values) => {
        if (onRequest) return
        setOnRequest(true)

        const { response, error } = await userApi.updatePassword(values)

        setOnRequest(false)

        if (error) toast.error(error.message)
        if (response) {
            form.resetForm()
            navigate("/")
            dispatch(setUser(null))
            dispatch(setAuthModalOpen(true))
            toast.success("Update password success! Please re-login")
        }
    }

    return (
        <Box sx={{ ...uiConfigs.style.mainContent }}>
            <Container header="update password">
                <Box
                    sx={{
                        maxWidth: { xs: "100%", md: "400px" }
                    }}
                    component="form"
                    onSubmit={form.handleSubmit}
                >
                    <Stack spacing={2}>
                        <TextField
                            type="password"
                            placeholder="password"
                            name="password"
                            fullWidth
                            value={form.values.password}
                            onChange={form.handleChange}
                            color="success"
                            error={form.touched.password && form.errors.password !== undefined}
                            helperText={form.touched.password && form.errors.password}
                        />
                        <TextField
                            type="password"
                            placeholder="new password"
                            name="newPassword"
                            fullWidth
                            value={form.values.newPassword}
                            onChange={form.handleChange}
                            color="success"
                            error={form.touched.newPassword && form.errors.newPassword !== undefined}
                            helperText={form.touched.newPassword && form.errors.newPassword}
                        />
                        <TextField
                            type="password"
                            placeholder="confirm new password"
                            name="confirmNewPassword"
                            fullWidth
                            value={form.values.confirmNewPassword}
                            onChange={form.handleChange}
                            color="success"
                            error={form.touched.newPconfirmNewPasswordassword && form.errors.confirmNewPassword !== undefined}
                            helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
                        />
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ marginTop: 4 }}
                            loading={onRequest}

                        >
                            update password
                        </LoadingButton>
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}

export default PasswordUpdate