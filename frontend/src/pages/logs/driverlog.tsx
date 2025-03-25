import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import DriverSheet from "../../components/driver_logs/sheet";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
 
import * as logService from "../../services/logServices";
import { useEffect, useState } from "react";
import { LogDay } from "../../types/logs";
import { useNavigate, useParams } from "react-router-dom";
import { appPaths } from "../../routes/paths";

const DriverLog = () => {

  const { id } = useParams<{ id: string }>();
  const [logsData, setLogsData] = useState<LogDay>();
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const fetchSingleLog = async (id: number) => {
    try {
      const response = await logService.singleLog(id);

      setLogsData(response);
    } catch (error) {
      navigate(appPaths.logsHistory);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSingleLog(parseInt(id));
  }, [id]);
 const navigate = useNavigate();
  return (
    <Container>
      <Stack paddingY={5} spacing={8}>
        <Stack alignItems={"center"} direction={"row"} spacing={2}>
          <Button onClick={()=>navigate(appPaths.updateLog.replace(":id", logsData?.id.toString()|| ""))}   startIcon={<EditIcon />} variant="contained" color="warning">
            Edit
          </Button>
          <Divider sx={{ flex: 1 }} />
          <Stack alignItems={"center"} direction={"row"} spacing={2}>
            <ButtonGroup variant="contained">
              <Button color="info" startIcon={<LocalPrintshopIcon />}>
                Print
              </Button>
              <Button color="error" startIcon={<PictureAsPdfIcon />}>
                Download
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
        {
          logsData?.trip &&<Box>
          <Typography fontSize={20} fontWeight={600} color="#818181">
            ⚠️ This log sheet is associated with a trip that spans {logsData.related_log_days?.length} days  
          </Typography>
       
        <Grid justifyContent={"center"} container spacing={7}>
          {
            logsData.related_log_days?.map((RlogId, index) => (
              <Button onClick={()=>navigate(appPaths.singleLog.replace(":id", RlogId.toString()|| ""))} key={index} variant={ RlogId ==logsData.id ?"outlined" :"contained"}>{`day ${index + 1}`}</Button>
            ))
          }
 
        </Grid>
        </Box>
        }
        
        <Paper  elevation={2}  sx={{ padding: 3 }}>
          <DriverSheet logsData={logsData||null} />
        </Paper>
      </Stack>
    </Container>
  );
};

export default DriverLog;
