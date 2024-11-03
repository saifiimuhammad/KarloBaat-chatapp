


import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import {
  Container,
  Paper
} from '@mui/material';



const Dashboard = () => {

  const Appbar = <Paper elevation={3} sx={{
    padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1rem"
  }}>
    sdf
    </Paper>

return (
  <AdminLayout>
  <Container component="main">
  {Appbar}
  </Container>
  </AdminLayout>
);
}

export default Dashboard;
