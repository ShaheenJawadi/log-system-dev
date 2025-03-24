import { Box, Container } from "@mui/material";
import ELDEntryForm from "../../components/driver_logs/manual/ELDEntry";

const ManualLogEntry = () => {
  return (
    <Container>
      <Box marginY={5} borderColor={"primary.main"} border={1} sx={{background:"#fff"}} padding={2} >
           <ELDEntryForm />
      </Box>
   
    </Container>
  );
};

export default ManualLogEntry;
