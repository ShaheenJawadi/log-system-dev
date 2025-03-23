import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import DriverSheet from "../../components/driver_logs/sheet";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
const DriverLog = () => {
  return (
    <Container>
      <Stack paddingY={5} spacing={8}>
        <Stack alignItems={"center"} direction={"row"} spacing={2}>
          <Button startIcon={<EditIcon />} variant="contained" color="warning">
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
        <Box>
          <Typography fontSize={20} fontWeight={600} color="#818181">
            ⚠️ This log sheet is associated with a trip that spans 4 days and
            cannot be modified
          </Typography>
        </Box>
        <Grid justifyContent={"center"} container spacing={7}>
          <Button variant="outlined">day 1</Button>
          <Button variant="contained">day 2</Button>
          <Button variant="contained">day 3</Button>
          <Button variant="contained">day 4</Button>
        </Grid>
        <Box borderColor={"primary.main"} border={1} padding={2}>
          <DriverSheet />
        </Box>
      </Stack>
    </Container>
  );
};

export default DriverLog;
