import { Box, Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import LogSheetFormPage from "../../components/driver_logs/manual/LogSheetForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as logService from "../../services/logServices";
import { LogDay } from "../../types/logs";
import { appPaths } from "../../routes/paths";

const ManualLogEntry = ({ isUpdate }: { isUpdate: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [logsData, setLogsData] = useState<LogDay | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const fetchSingleLog = async (id: number) => {
    try {
      const response = await logService.singleLog(id);

      setLogsData(response);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && isUpdate) fetchSingleLog(parseInt(id));
  }, [id]);
  if (isUpdate && (loading || !logsData)) {
    if (!loading && !logsData) {
      navigate(appPaths.newLog);
      return null;
    } else {
      return (
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      );
    }
  } else {
    return (
      <Container  maxWidth={false}   >
        <Stack spacing={2} paddingY={5}>
          <Typography
            textAlign={"center"}
            variant="h4"
            fontWeight={600}
            color="primary"
          >
            {isUpdate
              ? "Update Driver's Log Sheet"
              : "Create Driver's Log Sheet"}
          </Typography>

          <LogSheetFormPage isUpdate={isUpdate} initialData={logsData} />
        </Stack>
      </Container>
    );
  }
};

export default ManualLogEntry;
