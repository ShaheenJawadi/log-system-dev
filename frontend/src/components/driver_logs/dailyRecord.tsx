import {
  styled,
  Box, 
  Stack,
  Grid2 as Grid,
  Typography,
} from "@mui/material";

const StyledBoxWithUnderLine = styled(Box)(({ theme }) => ({
  borderBottom: `2px solid #000`,
  padding: theme.spacing(1),
  minHeight: 30,
}));

export const LogHeaderSection = () => {
  return (
    <Stack spacing={3}>
      <Grid container spacing={5}>
        <Grid size={4}>
          <Stack>
            <Typography textAlign={"center"} variant="h4">
              Drivers Daily Log
            </Typography>
            <Typography variant="body1" textAlign={"center"}>
              (24 hours)
            </Typography>
          </Stack>
        </Grid>
        <Grid size={3}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <Stack flex={1} spacing={1}>
              <StyledBoxWithUnderLine>{/* TT */}</StyledBoxWithUnderLine>
              <Typography textAlign={"center"} variant="body2">
                (month)
              </Typography>
            </Stack>
            <Box>
              <Typography fontSize={22} variant="h6">
                /
              </Typography>
            </Box>
            <Stack flex={1} spacing={1}>
              <StyledBoxWithUnderLine>{/* TT */}</StyledBoxWithUnderLine>
              <Typography textAlign={"center"} variant="body2">
                (day)
              </Typography>
            </Stack>
            <Box>
              <Typography fontSize={22} variant="h6">
                /
              </Typography>
            </Box>
            <Stack flex={1} spacing={1}>
              <StyledBoxWithUnderLine>{/* TT */}</StyledBoxWithUnderLine>
              <Typography textAlign={"center"} variant="body2">
                (year)
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid size={5}>
          <Stack>
            <Typography variant="body2" fontWeight={"bold"}>
              Original - File at home terminal.
            </Typography>
            <Typography variant="body1">
              Duplicate - Driver retains in his/her possession for 8 days.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Box>
        <Grid container spacing={10} marginX={30}>
          <Grid size={6}>
            <StyledBoxWithUnderLine>
              <Stack direction={"row"}  >
                <Typography variant="body2" fontWeight={"bold"} >
                  From:
                </Typography>
                <Typography>{/* TT */}</Typography>
              </Stack>
            </StyledBoxWithUnderLine>
          </Grid>
          <Grid size={6}>
          <StyledBoxWithUnderLine>
              <Stack direction={"row"}  >
                <Typography variant="body2" fontWeight={"bold"} >
                  To:
                </Typography>
                <Typography>{/* TT */}</Typography>
              </Stack>
            </StyledBoxWithUnderLine>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};
