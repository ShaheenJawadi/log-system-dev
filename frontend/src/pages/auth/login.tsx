import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  FormHelperText,
  Box,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../routes/paths";
import * as authService from "../../services/authServices";
import { setToken, setRefreshToken, getToken } from "../../utils/token";
import { toast } from "react-toastify";
import { ContentPaste } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
const LoginPage = () => {
  const { setSubmittingAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmittingAuth(true);
      try {
        const res = await authService.login(values);
        setToken(res.tokens.access);
        setRefreshToken(res?.tokens?.refresh || "");
        window.location.href = appPaths.home;
      } catch (error) {
        toast.error("Login failed! Please check your credentials.");
      } finally {
        setSubmittingAuth(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <Stack
      spacing={4}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        border="1px solid #ccc"
        borderRadius={2}
        bgcolor="#f5f5f5"
      >
        <Typography variant="body2">
          <strong>Demo Account:</strong> demo / 12345678
        </Typography>
        <Tooltip title="Fill with demo credentials">
          <IconButton
            onClick={() => {
              formik.setValues({
                username: "demo",
                password: "12345678",
              });
            }}
            size="small"
          >
            <ContentPaste fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <FormControl
        variant="outlined"
        error={formik.touched.username && Boolean(formik.errors.username)}
      >
        <InputLabel>Username</InputLabel>
        <OutlinedInput
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Username"
        />
        {formik.touched.username && formik.errors.username && (
          <FormHelperText>{formik.errors.username}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        variant="outlined"
        error={formik.touched.password && Boolean(formik.errors.password)}
      >
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {formik.touched.password && formik.errors.password && (
          <FormHelperText>{formik.errors.password}</FormHelperText>
        )}
      </FormControl>

      <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <Divider />
      <Typography variant="caption">Don't have an account?</Typography>
      <Button onClick={() => navigate(appPaths.register)} variant="outlined">
        Create an account
      </Button>
    </Stack>
  );
};

export default LoginPage;
