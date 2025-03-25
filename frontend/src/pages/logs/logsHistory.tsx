import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import RouteIcon from "@mui/icons-material/Route";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import MapIcon from "@mui/icons-material/Map";
import DeleteIcon from "@mui/icons-material/Delete";
import { appPaths } from "../../routes/paths";
import * as logService from "../../services/logServices";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogDay } from "../../types/logs";
import { useDialog } from "../../context/dialogContext";
import { log } from "console";
import EmptyComponant from "../../components/empty";
const LogsHistory = () => {
  const navigate = useNavigate();
  const { openDialog, refresh } = useDialog();
  const [logsData, setLogsData] = useState<LogDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const fetchList = async () => {
    try {
      const response = await logService.getListLogs();

      setLogsData(response);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [refresh]);
  const clickAction = (target: string, id: number, tripId: number) => {
    if (target == "singleLog") {
      navigate(appPaths.singleLog.replace(":id", id.toString()));
    } else if (target == "openMap") {
      navigate(appPaths.singleTrip.replace(":id", tripId.toString()));
    } else if (target == "delete") {
      openDialog("deleteLog", { id: id });
    }
  };
  return (
    <>
      {logsData.length === 0 ? (
        <EmptyComponant target="Logs" />
      ) : (<Container>
        <Grid container spacing={2} marginY={5}>
          {logsData.map((log, index) => {
            return (
              <SingleLogGrid
                key={index}
                action={(target) => clickAction(target, log.id, log.trip)}
                single={log}
              />
            );
          })}{" "}
        </Grid>  </Container>
      )}
  </>
  );
};

const SingleLogGrid = ({
  single,
  action,
}: {
  single: LogDay;
  action: (target: "openMap" | "singleLog" | "delete") => void;
}) => {
  return (
    <Grid size={4}>
      <Card>
        <CardContent>
          <Stack spacing={5}>
            <Box>
              <Typography
                textAlign={"center"}
                fontWeight={600}
                variant="h5"
                color="primary"
              >
                {single.log_sheet?.date}
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={3}>
              <Stack flex={1}>
                <Typography variant="h6" color="secondary">
                  From:
                </Typography>
                <Typography variant="body1">
                  {" "}
                  {single.log_sheet?.fromLocation}
                </Typography>
              </Stack>
              <Stack flex={1} direction={"row"}>
                <Typography variant="h6" color="secondary">
                  To:
                </Typography>
                <Typography variant="body1">
                  {" "}
                  {single.log_sheet?.toLocation}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={3} justifyContent={"center"} direction={"row"}>
              <Stack spacing={1} direction={"row"}>
                {single.trip ? (
                  <Chip
                    onClick={() => action("openMap")}
                    sx={{ cursor: "pointer" }}
                    label="Overview on map"
                    icon={<MapIcon />}
                    color="warning"
                  />
                ) : (
                  <Chip
                    label="No associated  trip"
                    icon={<MapIcon />}
                    color="default"
                  />
                )}
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
            <Divider />

            <Stack spacing={3} justifyContent={"end"} direction={"row"}>
              <Button
                onClick={() => action("delete")}
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
              <Button
                onClick={() => action("singleLog")}
                startIcon={<ShowChartIcon />}
                variant="contained"
                color="primary"
              >
                Open log
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default LogsHistory;
