import { Delete, Print, Share } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { formatMoney } from "../../../Common/helpers/format-money.helper";
import { useBill } from "../../hooks/useBills";
// import { generateInvoicePdf } from "../../helpers/generateInvoicePdf.helper";

/**
 * View to display the bill
 * @version v1.0 24-12-2023
 */
export const Bill = () => {
  const { id } = useParams();

  if (!id) return <div>Not found</div>;

  const { data: bill, isLoading } = useBill(+id);

  const handlePrint = async () => {
    // if (data) {
    //   const pdf = await generateInvoicePdf(data);
    //   pdf.open();
    // }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!bill) return <div>Not found</div>;

  return (
    <>
      <Container maxWidth="lg">
        <Stack
          spacing={3}
          my={2}
          direction={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "normal", sm: "space-between" }}
          alignItems={{ sm: "center" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box>
              <Typography variant="h3">Comprobante N° {bill.num}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <IconButton color="error" size="small">
              <Delete />
            </IconButton>
            <IconButton size="small">
              <Share />
            </IconButton>

            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={handlePrint}
              size="small"
            >
              Imprimir
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardHeader
            title={
              <Typography variant="h4"> Restaurante Doña Yoli </Typography>
            }
            action={
              <Box>
                <Typography variant="h4">Pedido N° {bill.num}</Typography>
              </Box>
            }
          />

          <CardContent>
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              // Establecer el tamaño de los elementos
            >
              <Box flexBasis="50%">
                <Typography variant="h5" mb={1}>
                  Cliente
                </Typography>
                <Typography variant="body1">{bill.client?.address}</Typography>
                <Typography variant="body1">
                  {bill.client?.person.email}
                </Typography>
                <Typography variant="body1">
                  {bill.client?.person.numPhone}
                </Typography>
                <Typography variant="body1">
                  {bill.client?.person.firstName} {bill.client?.person.lastName}
                </Typography>
              </Box>
              <Box flexBasis="50%">
                <Typography variant="h5" mb={1}>
                  Mesero
                </Typography>
                <Typography variant="body1">
                  {bill.owner.person.firstName} {bill.owner.person.lastName}
                </Typography>
                <Typography variant="body1">
                  {bill.owner.person.email}
                </Typography>
                <Typography variant="body1">
                  {bill.owner.person.numPhone}
                </Typography>
              </Box>
            </Stack>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              my={2}
            >
              <Box>
                <Typography variant="h5" mb={1}>
                  Fecha
                </Typography>
                <Typography variant="body1">
                  {format(new Date(bill?.createdAt), "dd MMMM yyyy HH:mm", {
                    locale: es,
                  })}
                </Typography>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {bill.details.map((detail) => {
                    return (
                      <TableRow
                        key={detail.id}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        <TableCell align="center">{detail.quantity}</TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {detail.orderDetail.product.name}
                        </TableCell>
                        <TableCell align="right">
                          {formatMoney(detail.price)}
                        </TableCell>
                        <TableCell align="right">
                          {formatMoney(detail.total)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={3}
                      sx={{
                        border: "none",
                      }}
                    >
                      <Typography variant="h6">Descuento</Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: "none",
                      }}
                    >
                      {formatMoney(bill.discount || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={3}
                      sx={{
                        border: "none",
                      }}
                    >
                      <Typography variant="h4">Total</Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: "none",
                      }}
                    >
                      {formatMoney(bill.total || 0)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
