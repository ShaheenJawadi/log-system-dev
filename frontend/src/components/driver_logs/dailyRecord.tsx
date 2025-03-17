import {
  styled,
  Box,
  Stack,
  Grid2 as Grid,
  Typography,
  TextField,
} from "@mui/material";

const StyledBoxWithUnderLine = styled(Box)(({ theme }) => ({
  borderBottom: `2px solid #000`,
  padding: theme.spacing(1),
  minHeight: 30,
  "&.smaller": {
    minHeight: 20,
  },
}));

const StyledBoxWithBorder = styled(Box)(({ theme }) => ({
  border: `2px solid #000`,
  padding: theme.spacing(1),
  minHeight: 40,
}));

export const LogHeaderSection = () => {
  return (
    <Stack spacing={10}>
      <FirstSec />
      <Box>
        <SecondSec />
      </Box>
    </Stack>
  );
};
const FirstSec = () => {
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
              <Stack direction={"row"}>
                <Typography variant="body2" fontWeight={"bold"}>
                  From:
                </Typography>
                <Typography>{/* TT */}</Typography>
              </Stack>
            </StyledBoxWithUnderLine>
          </Grid>
          <Grid size={6}>
            <StyledBoxWithUnderLine>
              <Stack direction={"row"}>
                <Typography variant="body2" fontWeight={"bold"}>
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
const SecondSec = () => {
  return (
    <Grid marginX={20} container spacing={3}>
      <Grid size={6}>
        <Stack spacing={2}>
          <Stack direction={"row"} spacing={2}>
            <Box flex={1}>
              <StyledBoxWithBorder></StyledBoxWithBorder>
              <Typography variant="body1" textAlign={"center"}>
                Total Miles Driving Today
              </Typography>
            </Box>
            <Box flex={1}>
              <StyledBoxWithBorder></StyledBoxWithBorder>
              <Typography variant="body1" textAlign={"center"}>
                Total Miles Driving Today
              </Typography>
            </Box>
          </Stack>

          <Box flex={1}>
            <StyledBoxWithBorder></StyledBoxWithBorder>
            <Typography variant="body1" textAlign={"center"}>
              Truck/Tractor and Trailer Numbers or <br />
              License Plate(s)/State (show each unit)
            </Typography>
          </Box>
        </Stack>
      </Grid>

      <Grid size={6}>
        <Stack spacing={0}>
          <Box flex={1}>
            <StyledBoxWithUnderLine className="smaller"></StyledBoxWithUnderLine>
            <Typography variant="body1" textAlign={"center"}>
              Name of Carrier or Carriers
            </Typography>
          </Box>
          <Box flex={1}>
            <StyledBoxWithUnderLine className="smaller"></StyledBoxWithUnderLine>
            <Typography variant="body1" textAlign={"center"}>
              Main Office Address
            </Typography>
          </Box>
          <Box flex={1}>
            <StyledBoxWithUnderLine className="smaller"></StyledBoxWithUnderLine>
            <Typography variant="body1" textAlign={"center"}>
              Home Terminal Address
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
