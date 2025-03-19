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
} from "@mui/material";
import React, { useState } from "react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Stack spacing={4}>
       <FormControl variant="outlined">
        <InputLabel>First name</InputLabel>
        <OutlinedInput type={"text"} label="Username" />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel>Last name</InputLabel>
        <OutlinedInput type={"text"} label="Username" />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel>Email</InputLabel>
        <OutlinedInput type={"text"} label="Username" />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel>Username</InputLabel>
        <OutlinedInput type={"text"} label="Username" />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <FormControl variant="outlined">
        <InputLabel>Repeat Password</InputLabel>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Button variant="contained">Register</Button>

      <Divider />
      <Typography variant="caption">You   have an accout ?</Typography>
      <Button variant="outlined">Login here</Button>
    </Stack>
  );
};

export default RegisterPage;
