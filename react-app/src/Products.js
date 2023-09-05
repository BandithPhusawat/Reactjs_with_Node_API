import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import {
      Box,
      Button,
      Dialog,
      DialogActions,
      DialogContent,
      DialogTitle,
      IconButton,
      MenuItem,
      Stack,
      TextField,
      Tooltip,
} from '@mui/material';
import {
      GridRowModes,
      DataGrid,
      GridToolbarContainer,
      GridActionsCellItem,
      GridRowEditStopReasons,
} from '@mui/x-data-grid';
    import {
      randomCreatedDate,
      randomTraderName,
      randomId,
      randomArrayItem,
} from '@mui/x-data-grid-generator';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const columns = [
      { 
            field: 'id', headerName: 'ID', width: 90 },
      {
            field: 'name',
            headerName: 'Price Name',
            width: 450,
            editable: true,
      },
      {
            field: 'price',
            headerName: 'Price',
            width: 250,
            editable: true,
      },
      {
            field: 'type_no',
            headerName: 'Type',
            type: 'number',
            width: 110,
            editable: true,
      },
      {
            field: 'Action',
            headerName: 'Action',
            type: 'number',
            width: 110,
            editable: true,
      },
      
    ];


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Album() {
      
      const [rows, setRows] = useState([]);
      
      useEffect(() => {
            const token = localStorage.getItem('token')
            fetch('http://localhost:3333/authen',{
        method: 'POST',
        headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' +token,
            }

      })
        .then(response => response.json())
        .then(data => {
            if(data.status === "ok"){
                console.log('authen success');
                componentDidMount();

            }else{
                  localStorage.removeItem("token", data.token);
                  window.location = '/';
            }
        })
        .catch((error) => {
            console.log('Error :',error)
      })

    }, [])
  

// get all products !
    const componentDidMount = () => {
      const token = localStorage.getItem('token')
      fetch('http://localhost:3333/products',{
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' +token,
                }
    
          })
            .then(response => response.json())
            .then(data => {
                if(data.status === "ok"){
                    console.log('product list ');
                    console.log(data.data);
                    setRows(data.data);
    
                }else{
                      localStorage.removeItem("token", data.token);
                      window.location = '/';
                }
            })
            .catch((error) => {
                console.log('Error :',error)
          })
      }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <AddToQueueIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Products List
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
            <Box sx={{ height: '100%', width: '100%' }}>
                  <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                        pagination: {
                              paginationModel: {
                              pageSize: 10,
                              },
                        },
                        }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  />
            </Box>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}