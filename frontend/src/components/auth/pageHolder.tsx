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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Holder = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
}));

const AuthPageHolder = ({ children , title  }: { children: ReactNode , title : string }) => {
  return (
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
          </Stack>
        </CardContent>
      </Card>
    </Holder>
  );
};

export default AuthPageHolder;
