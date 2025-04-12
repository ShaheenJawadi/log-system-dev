import { Box, Stack, styled, Typography } from "@mui/material";

const Holder = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  zIndex: 999999,
  height: "100vh",
  width: "100vw",
  backdropFilter: "blur(10px)",
}));
const ServerStatus = ({ isServerSleep }: { isServerSleep: boolean }) => {
  
    if (!isServerSleep) return null;  

  return (
    <Holder>
      <Stack
        bgcolor={"#fff25491"}
        justifyContent={"center"}
        padding={2}
        borderRadius={2}
        width={"80%"}
        height={"50%"}
        textAlign={"center"}
      >
        <Typography
          variant="h4"
          color="secondary"
          fontWeight={600}
          textAlign={"center"}
        >
          ⏳ Just a moment...
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          fontWeight={600}
          textAlign={"center"}
        >
          This demo is hosted on Render’s free plan, which may take 20–30
          seconds to wake up after being idle.
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          fontWeight={600}
          textAlign={"center"}
        >
          Thanks for your patience!
        </Typography>
      </Stack>
    </Holder>
  );
};

export default ServerStatus;
