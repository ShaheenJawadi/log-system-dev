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
import LogoutIcon from '@mui/icons-material/Logout';
import Grid from "@mui/material/Grid2";
import { headerHeight } from "../utils/constatnts";
import { appPaths } from "../routes/paths";
import PolylineIcon from "@mui/icons-material/Polyline";
import HistoryIcon from "@mui/icons-material/History";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useAuth } from "../context/authContext";
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
      label: " Trip History ",
      path: appPaths.history,
      color: "#fff",
      bg: "#051830",
      icon: <HistoryIcon sx={{ color: "#fff", fontSize: 140 }} />,
    },
    {
      label: " Manual Log Entry ",
      path: appPaths.newEld,
      color: "#fff",
      bg: "#008080",
      icon: (
        <DriveFileRenameOutlineIcon sx={{ color: "#fff", fontSize: 140 }} />
      ),
    },
    {
      label: " My Logs ",
      path: appPaths.myLogs,
      color: "#fff",
      bg: "#051830",
      icon: (
        <Inventory2Icon sx={{ color: "#fff", fontSize: 140 }} />
      ),
    },
    {
      label: "Settings",
      path: appPaths.setting,
      color: "#fff",
      bg: "#008080",
      icon: <SettingsIcon sx={{ color: "#fff", fontSize: 140 }} />,
    },
   
  
    {
      label: "Logout",
      path: null,
      color: "#fff",
      bg: "#f84960",
      icon: <LogoutIcon sx={{ color: "#fff", fontSize: 140 }} />,
    },
  ];

  const navigate = useNavigate();
  const {logout} = useAuth();


  const clickAction =(btn: any)=>{
    if(btn.label === "Logout"){ 
      
      logout();
      
    }
    else { 
      navigate(btn.path)
    }
 
  }
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
                onClick={() => clickAction(btn)}
                sx={{ height: 365, backgroundColor: btn.bg, color: btn.color }}
              >
                <IconHolder>{btn.icon}</IconHolder>
                <CardContent>
                  <Typography color={btn.color} fontWeight={700} fontSize={55}>
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
