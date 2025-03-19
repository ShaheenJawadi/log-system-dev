import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import Logo from "../Logo";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PerfectScrollbar from "react-perfect-scrollbar";

const Holder = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  width: "100vw",
  margin: 5,
}));

const AuthPageHolder = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <PerfectScrollbar>
      <Holder>
        <Card>
          <CardContent>
            <Stack paddingX={5} spacing={3}>
              <Stack alignItems={"center"} direction={"row"}>
                <Logo size={50} />
                <CardHeader
                  title="Truckers Journal"
                  subheader="Your personal trucking assistant"
                />
              </Stack>
              <Divider />
              <Stack alignItems={"center"} spacing={4} direction={"row"}>
                <Typography fontWeight={600} fontSize={23} color="secondary">
                  {title}
                </Typography>
                <LocalShippingIcon fontSize={"medium"} color="secondary" />
              </Stack>

              {children}
            </Stack>
          </CardContent>
        </Card>
      </Holder>
    </PerfectScrollbar>
  );
};

export default AuthPageHolder;
