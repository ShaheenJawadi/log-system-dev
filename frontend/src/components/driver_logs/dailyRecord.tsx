import { Margin } from "@mui/icons-material";
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
  "&.spec": {
    marginTop: 25,
  },
}));

const StyledBoxWithBorder = styled(Box)(({ theme }) => ({
  border: `2px solid #000`,
  padding: theme.spacing(1),
  minHeight: 40,
}));

const StyledShippingBox = styled(Box)(({ theme }) => ({
  borderBottom: `4px solid #000`,
  borderLeft: `4px solid #000`,
  padding: theme.spacing(1),
  position: "relative",
  paddingBottom: 25,
  marginBottom: 20,
}));

const StyledShippingSep = styled(Box)(({ theme }) => ({
  borderBottom: `2px solid #000`,

  width: 150,
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

export const ShippingSection = () => {
  return (
    <Box>
      <StyledShippingBox>
        <Stack paddingTop={10} spacing={3}>
          <Typography variant="h6" fontWeight={"bold"}>
            Shipping <br /> Documents:
          </Typography>
          <StyledShippingSep />

          <Stack spacing={5} direction={"row"}>
            <Typography variant="body2" minWidth={150} fontWeight={"bold"}>
              DVL or Manifest No. <br /> or
            </Typography>

            <Typography variant="body2">{/* TT */}</Typography>
          </Stack>
          <StyledShippingSep />
          <Stack spacing={5} direction={"row"}>
            <Typography variant="body2" minWidth={150} fontWeight={"bold"}>
              {" Shipper & Commodity"}
            </Typography>

            <Typography variant="body2">{/* TT */}</Typography>
          </Stack>

          <Typography
            paddingTop={4}
            variant="body2"
            textAlign={"center"}
            fontWeight={"bold"}
          >
            Enter name of place you reported and where released from work and
            when and where each change of duty occurred.{" "}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          position={"absolute"}
          bottom={-10}
          width={"100%"}
          right={0}
          alignContent={"center"}
          justifyContent={"center"}
        >
          <Box sx={{ backgroundColor: "white" }} paddingX={5}>
            <Typography
              variant="body2"
              textAlign={"center"}
              fontWeight={"bold"}
            >
              Use time standard of home terminal.
            </Typography>
          </Box>
        </Stack>
      </StyledShippingBox>
    </Box>
  );
};

export const HourRecapSection = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={1.09}>
          <Typography variant="body2" fontWeight={"bold"}>
            Recap: Complete at end of day
          </Typography>
        </Grid>
        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec"></StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            On duty hours today, Total lines 3 & 4
          </Typography>
        </Grid>
        <Grid size={1.09}>
          <Typography variant="body2" fontWeight={"bold"}>
            70 Hour/ 8 Day Drivers
          </Typography>
        </Grid>
        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec">
            <Stack direction={"row"}>
              <Typography variant="body2" fontWeight={"bold"}>
                A.
              </Typography>
              <Typography>{/* TT */}</Typography>
            </Stack>
          </StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            A. Total hours on duty last 7 days including today.
          </Typography>
        </Grid>

        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec">
            <Stack direction={"row"}>
              <Typography variant="body2" fontWeight={"bold"}>
                B.
              </Typography>
              <Typography>{/* TT */}</Typography>
            </Stack>
          </StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            B. Total hours available tomorrow 70 hr. minus A*.
          </Typography>
        </Grid>

        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec">
            <Stack direction={"row"}>
              <Typography variant="body2" fontWeight={"bold"}>
                C.
              </Typography>
              <Typography>{/* TT */}</Typography>
            </Stack>
          </StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            C. Total hours on duty last 5 days including today.
          </Typography>
        </Grid>
        <Grid size={1.09}>
          <Typography variant="body2" fontWeight={"bold"}>
            60 Hour/ 7 Day Drivers
          </Typography>
        </Grid>

        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec">
            <Stack direction={"row"}>
              <Typography variant="body2" fontWeight={"bold"}>
                A.
              </Typography>
              <Typography>{/* TT */}</Typography>
            </Stack>
          </StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            A. Total hours on duty last 8 days including today.
          </Typography>
        </Grid>

        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec">
            <Stack direction={"row"}>
              <Typography variant="body2" fontWeight={"bold"}>
                B.
              </Typography>
              <Typography>{/* TT */}</Typography>
            </Stack>
          </StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            B. Total hours available tomorrow 60 hr. minus A*
          </Typography>
        </Grid>

        <Grid size={1.09}>
          <StyledBoxWithUnderLine className="spec">
            <Stack direction={"row"}>
              <Typography variant="body2" fontWeight={"bold"}>
                C.
              </Typography>
              <Typography>{/* TT */}</Typography>
            </Stack>
          </StyledBoxWithUnderLine>
          <Typography variant="body2" fontWeight={"bold"}>
            C. Total hours on duty last 7 days including today.
          </Typography>
        </Grid>

        <Grid size={1.09}>
          <Typography variant="body2" fontWeight={"bold"}>
            *If you took <br /> 34 <br /> consecutive hours off duty you have
            60/70 hours avaialble
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
