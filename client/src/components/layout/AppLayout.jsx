
import Header from './Header.jsx';
import Title from '../shared/Title.jsx';

import { Grid } from '@mui/material';



const AppLayout = () => (WrappedComponent) => {

  return (props) => {
    return (
      <>
      <Title/>
      <Header/>

      <Grid container height="calc(100vh - 4rem)">
      <Grid item xs={3} height="100%" bgcolor="primary.main"></Grid>
      </Grid>


      <WrappedComponent {...props} />
      </>
    );
  };
}


export default AppLayout;
