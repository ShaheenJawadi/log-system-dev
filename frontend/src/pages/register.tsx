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
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import { appPaths } from "../routes/paths"; 
import * as authService from "../services/authServices";  


const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
 
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      username: Yup.string().required("Username is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.register(values);  
        console.log("Registration successful", response);
        navigate(appPaths.login);  
      } catch (error) {
        console.error("Registration failed", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Stack spacing={4} component="form" onSubmit={formik.handleSubmit}> 
      <FormControl variant="outlined" error={formik.touched.first_name && Boolean(formik.errors.first_name)}>
        <InputLabel>First name</InputLabel>
        <OutlinedInput
          type="text"
          name="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="First name"
        />
        {formik.touched.first_name && formik.errors.first_name && (
          <FormHelperText>{formik.errors.first_name}</FormHelperText>
        )}
      </FormControl>
 
      <FormControl variant="outlined" error={formik.touched.last_name && Boolean(formik.errors.last_name)}>
        <InputLabel>Last name</InputLabel>
        <OutlinedInput
          type="text"
          name="last_name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Last name"
        />
        {formik.touched.last_name && formik.errors.last_name && (
          <FormHelperText>{formik.errors.last_name}</FormHelperText>
        )}
      </FormControl>
 
      <FormControl variant="outlined" error={formik.touched.email && Boolean(formik.errors.email)}>
        <InputLabel>Email</InputLabel>
        <OutlinedInput
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Email"
        />
        {formik.touched.email && formik.errors.email && (
          <FormHelperText>{formik.errors.email}</FormHelperText>
        )}
      </FormControl>
 
      <FormControl variant="outlined" error={formik.touched.username && Boolean(formik.errors.username)}>
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
 
      <FormControl variant="outlined" error={formik.touched.password && Boolean(formik.errors.password)}>
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
 
      <FormControl variant="outlined" error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
        <InputLabel>Confirm Password</InputLabel>
        <OutlinedInput
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
        )}
      </FormControl>
 
      <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Registering..." : "Register"}
      </Button>

      <Divider />
      <Typography variant="caption">Already have an account?</Typography>
      <Button onClick={() => navigate(appPaths.login)} variant="outlined">
        Login here
      </Button>
    </Stack>
  );
};

export default RegisterPage;
