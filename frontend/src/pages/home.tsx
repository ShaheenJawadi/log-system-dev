import React from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { headerHeight } from "../utils/constatnts";
import { appPaths } from "../routes/paths";
import PolylineIcon from "@mui/icons-material/Polyline";
import HistoryIcon from "@mui/icons-material/History";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useNavigate } from "react-router-dom";

const IconHolder = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 1,
  right: 1,
  opacity: 0.7,
}));
const BtnCard = styled(Card)(({ theme }) => ({
  position: "relative",
  padding: 5,
  paddingTop: 100,
  cursor: "pointer",
}));

const Home: React.FC = () => {
  const btnsMenu = [
    {
      label: "Plan a Trip",
      path: appPaths.newTrip,
      color: "#fff",
      bg: "#008080",
      icon: <PolylineIcon sx={{ color: "#fff", fontSize: 140 }} />,
    },
    {
      label: " Manual Log Entry ",
      path: appPaths.newEld,
      color: "#fff",
      bg: "#051830",
      icon: (
        <DriveFileRenameOutlineIcon sx={{ color: "#fff", fontSize: 140 }} />
      ),
    },
    {
      label: " Trip History ",
      path: appPaths.history,
      color: "#fff",
      bg: "#f84960",
      icon: <HistoryIcon sx={{ color: "#fff", fontSize: 140 }} />,
    },
  ];

  const navigate = useNavigate();

  return (
    <Container>
      <Stack
        justifyContent={"center"}
        height={`calc(100vh - ${headerHeight}px)`}
      >
        <Grid container spacing={3}>
          {btnsMenu.map((btn) => (
            <Grid size={4}>
              <BtnCard
                onClick={() => navigate(btn.path)}
                sx={{ height: 365, backgroundColor: btn.bg, color: btn.color }}
              >
                <IconHolder>{btn.icon}</IconHolder>
                <CardContent>
                  <Typography color={btn.color} fontWeight={700} fontSize={40}>
                    {btn.label}
                  </Typography>
                </CardContent>
              </BtnCard>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default Home;
