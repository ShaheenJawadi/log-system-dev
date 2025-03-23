import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import RouteIcon from "@mui/icons-material/Route";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MapIcon from '@mui/icons-material/Map';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { useDialog } from "../../context/dialogContext";
import { appPaths } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
const LogsHistory = () => {
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  return (
    <Container> 
      <Grid container spacing={2} marginY={5}>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Stack spacing={5}>
                <Box>
                  <Typography textAlign={"center"} fontWeight={600} variant="h5" color="primary">
                    04/12/1998
                  </Typography>
                </Box>
                <Divider/>
                <Stack spacing={3} >
                  <Stack flex={1}>
                    <Typography variant="h6" color="secondary">
                      From:  
                    </Typography>
                    <Typography variant="body1"> {/* TT */} 
                    </Typography>
                  </Stack>
                  <Stack flex={1} direction={"row"}>
                    <Typography variant="h6" color="secondary">
                      To:  
                    </Typography>
                    <Typography variant="body1"> {/* TT */} 
                    </Typography>
                  </Stack>
                </Stack>
           
                <Stack spacing={3} justifyContent={"center"} direction={"row"}>
                  <Stack spacing={1} direction={"row"}> 
                    <DateRangeIcon color="primary" />
                    <Typography
                      textAlign={"center"}
                      variant="body2" 
                      fontWeight={600}
                    >
                      Total Days:
                    </Typography>
                    <Typography>500</Typography>
                  </Stack>
                 
                  <Stack spacing={1} direction={"row"}> 
                    <RouteIcon color="primary" />
                    <Typography
                      textAlign={"center"}
                      variant="body2" 
                      fontWeight={600}
                    >
                      Total Miles:
                    </Typography>
                    <Typography>500</Typography>
                  </Stack>
                  <Stack direction={"row"}></Stack>
                </Stack>
                <Divider/>

                <Stack spacing={3} justifyContent={"end"} direction={"row"}>
                  <Button onClick={()=>openDialog("deleteLog" , {id:3})} startIcon={<DeleteIcon/>} variant="contained" color="error">
                    Delete
                  </Button>
                  <Button onClick={()=> navigate(appPaths.singleLog.replace(":id", "5"))} startIcon={<ShowChartIcon/>} variant="contained" color="primary">
                    Open log
                  </Button>
                 
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LogsHistory;
 
