import { Box, Container } from "@mui/material";
import React, { ReactNode } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import MainHeader from "./mainHeader";
import { headerHeight } from "../utils/constatnts";

const MainPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <MainHeader />
      <PerfectScrollbar>
        <Container>
          <Box  paddingY={10} sx={{ maxHeight: `calc(100vh - ${headerHeight}px)`}}>{children}</Box>
        </Container>
      </PerfectScrollbar>
    </Box>
  );
};

export default MainPageContainer;
