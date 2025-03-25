import { Stack, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

const EmptyComponant = ({ target }: { target: string }) => {
  return (
    <Stack
      spacing={15}
      width={"100%"}
      height={"100%"}
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        sx={{ borderRadius: 150 }}
        bgcolor="#ff7a885c"
        p={20}
        justifyContent="center"
        alignItems="center"
      >
        <FolderIcon sx={{ fontSize: 205, opacity: 0.7 }} color="error" />
      </Stack>
      <Typography variant="h2" fontWeight={700} color="primary">
        No {target} found
      </Typography>
    </Stack>
  );
};

export default EmptyComponant;
