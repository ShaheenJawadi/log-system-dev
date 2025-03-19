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
import { appPaths } from "../routes/paths";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Stack spacing={4}>

<FormControl variant="outlined">
        <InputLabel>Username</InputLabel>
        <OutlinedInput
          type={ "text" }
       
          label="Username"
        />
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

      <Button variant="contained">Login</Button>

      <Divider/>
      <Typography variant="caption">You dont have an accout ?</Typography>
      <Button onClick={ ()=>navigate(appPaths.register) } variant="outlined">Create an account</Button>

    </Stack>
  );
};

export default LoginPage;
