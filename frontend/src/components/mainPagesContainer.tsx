import { Box, Stack } from "@mui/material";
import React, { ReactNode } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import MainHeader from "./mainHeader";
import { headerHeight } from "../utils/constatnts";

const MainPageContainer = ({ children , title }: { children: ReactNode , title:string }) => {
  return (
    <Stack sx={{ height: "100vh" }}>
      <MainHeader title={title} />
      <Box sx={{ flex: 1 }}>
        <PerfectScrollbar>
          <Box 
            sx={{ height:"100%" }}
          >
            {children}
          </Box>
        </PerfectScrollbar>
      </Box>
    </Stack>
  );
};

export default MainPageContainer;
