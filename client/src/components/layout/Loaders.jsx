

import React from 'react';
import { Grid, Skeleton, Stack } from '@mui/material';


export const LayoutLoader = () => {
  return (
    <>
      <Grid container height="calc(100vh - 4rem)">
      <Grid item sm={4} md={3} height="100%" sx={{
        display: { xs: "none", sm: "block" },
      }}>
    <Skeleton variant="rectangular" height="100vh"/>
    </Grid>
      <Grid item xs={12} sm={8} md={5} lg={6}  height="100%">
    {
      Array.from({length: 10}).map((_, index) => {
        return (
          <Stack key={index} spacing="1rem">
          <Skeleton variant="rectangular" height="5rem"/>
          </Stack>
        );
      })
    }
      </Grid>
      <Grid item md={4} lg={3} height="100%" sx={{
        display: {xs: "none", md:"block"},
          padding: "2rem",
          bgcolor: "rgba(0,0,0,0.85)",
      }}>
    <Skeleton variant="rectangular" height="100vh"/>
    </Grid>
      </Grid>
    </>
  ); 
}
