import { Box, Container, Stack, Typography } from "@mui/material";
import LogSheetFormPage from "../../components/driver_logs/manual/LogSheetForm";
import { LogSheet } from "../../types/logs";

const ManualLogEntry = () => {
  const isUpdate = false;
  
  return (
    <Container>
      <Stack spacing={2} paddingY={5}>
        <Typography
          textAlign={"center"}
          variant="h4"
          fontWeight={600}
          color="primary"
        >
          {isUpdate ? "Update Driver's Log Sheet" : "Create Driver's Log Sheet"}
        </Typography>

        <LogSheetFormPage   initialData={null} />
      </Stack>
    </Container>
  );
};

export default ManualLogEntry;
