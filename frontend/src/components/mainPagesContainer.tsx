import { Box, Container, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import MainHeader from "./mainHeader";

const MainPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <MainHeader />
      <PerfectScrollbar>
        <Container>
          <Box paddingY={10}>{children}</Box>
        </Container>
      </PerfectScrollbar>
    </Box>
  );
};

export default MainPageContainer;
