import {
    Box, 
    Stack, 
    Typography,
  } from "@mui/material";
  import React from "react";
  
  const MainHeader: React.FC = () => {
    return (
      <div>
        <Box sx={{ backgroundColor: "secondary.main" }}>
           
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} sx={{ height: 62 }}>
            
              <Box sx={{flex:1}}>
                <Typography variant="h6" align="center" color="white">Date-Time</Typography>
              </Box>
              <Stack    justifyContent={"center"} sx={{backgroundColor: "primary.main", height: "100%", paddingX: 10}}>
              <Typography  variant="caption" color="white" >Current status</Typography>
  
                  <Typography variant="h6" color="white" >Driving</Typography>
              </Stack>
            </Stack> 
        </Box>
      </div>
    );
  };
  
  export default MainHeader;
  