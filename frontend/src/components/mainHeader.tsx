import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import Logo from "./Logo";
import { headerHeight } from "../utils/constatnts";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../routes/paths";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
const MainHeader: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Box sx={{ backgroundColor: "secondary.main" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{ height: headerHeight }}
        >
          <Box marginLeft={10}>
            <Logo size={48} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              align="center"
              fontWeight={600}
              color="white"
            >
              {title}
            </Typography>
          </Box>
          <Stack
            direction={"row"}
            sx={{
              height: "100%",
            }}
            alignItems={"center"}
          >
            <Box>
              <IconButton sx={{ color: "#fff" }} onClick={() => navigate(-1)}>
                <ArrowBackIosIcon />
              </IconButton>
            </Box>
            <Stack
              onClick={() => navigate(appPaths.home)}
              spacing={3}
              alignItems={"center"}
              direction={"row"}
              justifyContent={"center"}
              sx={{
                height: "100%",
                backgroundColor: "primary.main",
                paddingX: 5,
              }}
            >
              <HomeIcon sx={{ color: "#fff", fontSize: 30 }} />
              <Typography variant="h6" fontWeight={600} color="white">
                Home
              </Typography>
            </Stack>{" "}
          </Stack>
        </Stack>
      </Box>
    </div>
  );
};

export default MainHeader;
