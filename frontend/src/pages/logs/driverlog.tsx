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
import { useReactToPrint } from "react-to-print";
import * as logService from "../../services/logServices";
import { useEffect, useRef, useState } from "react";
import { LogDay } from "../../types/logs";
import { useNavigate, useParams } from "react-router-dom";
import { appPaths } from "../../routes/paths";

const DriverLog = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const printSheet = useReactToPrint({ contentRef });

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
          <Button
            onClick={() =>
              navigate(
                appPaths.updateLog.replace(":id", logsData?.id.toString() || "")
              )
            }
            startIcon={<EditIcon />}
            variant="contained"
            color="warning"
          >
            Edit
          </Button>
          <Divider sx={{ flex: 1 }} />
          <Stack alignItems={"center"} direction={"row"} spacing={2}>
            <ButtonGroup variant="contained">
              <Button
                onClick={() => printSheet()}
                color="info"
                startIcon={<LocalPrintshopIcon />}
              >
                Print
              </Button>
              <Button color="error" startIcon={<PictureAsPdfIcon />}>
                Download
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
        {logsData?.trip && (
          <Stack spacing={5}>
            <Typography fontSize={20} fontWeight={600} color="#818181">
              This log sheet is associated with a trip
              {(logsData.related_log_days?.length ?? 0) > 1
                ? "  that spans " + logsData.related_log_days?.length + " days"
                : ""}
              <Button
                color="primary"
                onClick={() =>
                  navigate(
                    appPaths.singleTrip.replace(
                      ":id",
                      logsData.trip.toString() || ""
                    )
                  )
                }
                variant="text"
              >{`🗺️  overview on map`}</Button>
            </Typography>

            {(logsData.related_log_days?.length ?? 0) > 1 && (
              <Grid justifyContent={"center"} container spacing={5}>
                {logsData.related_log_days?.map((RlogId, index) => (
                  <Button
                    onClick={() =>
                      navigate(
                        appPaths.singleLog.replace(
                          ":id",
                          RlogId.toString() || ""
                        )
                      )
                    }
                    key={index}
                    variant={RlogId == logsData.id ? "outlined" : "contained"}
                  >{`day ${index + 1}`}</Button>
                ))}
              </Grid>
            )}
          </Stack>
        )}

        <Paper elevation={2}>
          <Box ref={contentRef} sx={{ padding: 3 }}>
            <DriverSheet logsData={logsData || null} />
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default DriverLog;
