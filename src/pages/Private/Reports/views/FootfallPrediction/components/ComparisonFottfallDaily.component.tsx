import { Grid, Card, CardHeader, CardContent, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography, Table, Button, Stack, TextField } from '@mui/material';
import { Line } from "react-chartjs-2";
import { LinearProgressWrapper } from "./ComparisonFootfall.component";
import { DatePicker } from '@mui/x-date-pickers';
import { Print } from '@mui/icons-material';
import { useComparisonFootfall } from '../../../hooks/useFootfall';
import { format } from 'date-fns';
import { GroupBy, Period } from '../../../../Common/dto/period.model';
import { es } from 'date-fns/locale';
import { useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';
import html2canvas from 'html2canvas';
import { generateFootfallComparisonReport } from '../../../helpers/pdf-footfall-comparison-report.helper';



export const ComparisonFottfallDaily = () => {

  const chartRef = useRef<ChartJS>(null);

  const filters = useComparisonFootfall(Period.MONTHLY, GroupBy.DAY);

  const {startDate, handleChangeStartDate, comparisonFootfallQuery} = filters;
  

  const predictedData = [100, 150, 200, 250]; // Datos de afluencia predecida
  const actualData = [90, 160, 190, 260]; // Datos de afluencia real

  const data = {
    labels: comparisonFootfallQuery.data?.footfall?.map(f => format(new Date(f.date), 'eeee dd/MM/yyyy', {locale: es})), // Etiquetas para cada punto de tiempo
    datasets: [
      {
        label: 'Afluencia Predecida',
        data: comparisonFootfallQuery.data?.footfall?.map(f => Number(f.forecast)),
        borderColor: 'rgba(75, 192, 192, 1)', // Color de borde para la línea de afluencia predecida
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo para el área debajo de la línea de afluencia predecida
      },
      {
        label: 'Afluencia Real',
        data: comparisonFootfallQuery.data?.footfall?.map(f => Number(f.real)),
        borderColor: 'rgba(192, 75, 75, 1)', // Color de borde para la línea de afluencia real
        backgroundColor: 'rgba(192, 75, 75, 0.2)', // Color de fondo para el área debajo de la línea de afluencia real
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handlePrint = async () => {

    let urlImage = '';

    
    if (chartRef.current) {

      const canvas = await html2canvas(chartRef.current.canvas);

      urlImage = canvas.toDataURL('image/png');
    };

    if(!comparisonFootfallQuery.data) return;

    const pdf = await generateFootfallComparisonReport(comparisonFootfallQuery.data, filters, urlImage);

    pdf.open();
  }

  

  return (
    <>
       <Stack direction='row' spacing={2} my={2}>
        <DatePicker
          views={['month', 'year']}
          label="Año"
          value={startDate}
          onChange={handleChangeStartDate}
          renderInput={(params) => <TextField  {...params} />}

        />

        <Button
          variant='contained'
          startIcon={<Print />}
          onClick={handlePrint}
        >

          Imprimir

        </Button>

      </Stack>

      <Grid container spacing={2}>

        <Grid item xs={12} md={12}>
          <Card >

            <CardHeader title="Asistencia de la semana" />
            <CardContent>

              {
                comparisonFootfallQuery.data &&
                <Line data={data} options={options} ref={chartRef}/>

              }

            </CardContent>

          </Card>

        </Grid>


        <Grid item xs={7}>

          <Card >

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell align="right">Afluencia Predecida</TableCell>
                    <TableCell align="right">Afluencia Real</TableCell>
                    <TableCell align="right">Diferencia</TableCell>

                  </TableRow>
                </TableHead>

                  <TableBody>

                    {

                      comparisonFootfallQuery.data?.footfall?.map(f => (
                        <TableRow key={f.date}>
                          <TableCell>
                            {format(new Date(f.date), 'eeee dd/MM/yyyy', {locale: es})}
                          </TableCell>
                          <TableCell align="right">{f.forecast}</TableCell>
                          <TableCell align="right">{f.real}</TableCell>
                          <TableCell align="right">{f.difference}</TableCell>

                        </TableRow>
                      ))



                    }

                  </TableBody>
              </Table>

            </TableContainer>
          </Card>

        </Grid>

        <Grid item xs={5}>

          <Card>

            <CardHeader title="Métricas" titleTypographyProps={{ variant: 'h4' }} />
            <CardContent>
              <Grid container spacing={2}>


                <Grid item xs={6}>
                  <Typography variant='h4' >MAE</Typography>
                  <Typography variant='subtitle2'>Error Absoluto Medio</Typography>

                  <LinearProgressWrapper
                    value={comparisonFootfallQuery.data?.mae}
                    color="error"
                    variant="determinate"
                    sx={{
                      width: '100%',
                      height: '10px',

                    }}

                  />
                  <Typography variant='h6' >{comparisonFootfallQuery.data?.mae} %</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='h4' >MAPE</Typography>
                  <Typography variant='subtitle2'>Error Porcentual Absoluto Medio</Typography>

                  <LinearProgressWrapper
                    value={comparisonFootfallQuery.data?.mape}
                    color="error"
                    variant="determinate"
                    sx={{
                      width: '100%',
                      height: '10px',

                    }}

                  />
                  <Typography variant='h6' >{comparisonFootfallQuery.data?.mape} %</Typography>


                </Grid>

              </Grid>


            </CardContent>
          </Card>


        </Grid>

      </Grid>


    </>
  )
}