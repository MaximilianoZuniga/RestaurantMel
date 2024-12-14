import { FC, useState } from "react";

import {
  Box,
  Typography,
  styled,
  LinearProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Chip,
  Checkbox,
} from "@mui/material";

import { IOrderDetail } from "../../../../../../models";
import {
  CheckCircle,
  CheckCircleOutline,
  MoreVertOutlined,
} from "@mui/icons-material";
import { UpdateOrderDetailDto } from "../../../dto";
import { useUpdateOrderDetail } from "../../../hooks";
import NiceModal from "@ebay/nice-modal-react";
import { ModalEditOrderDetail } from "../../../components";
import { format, formatDistance } from "date-fns";
import { es } from "date-fns/locale";

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        height: 6px;
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }`
);

interface Props {
  detail: IOrderDetail;
  orderId: string;
}

/**
 * Component to show the details of the order in progress
 * @version 1.1 20/12/2023 Adds product options chip
 * @version 1.2 28/12/2023 Adds useUpdateOrderDetail hook
 */
export const DetailInProgress: FC<Props> = ({ detail, orderId }) => {
  const { mutate: update } = useUpdateOrderDetail();

  const [checked, setChecked] = useState(
    detail.qtyDelivered === detail.quantity
  );

  const editDetail = () => {
    NiceModal.show(ModalEditOrderDetail, { detail: detail, orderId: orderId });
  };

  const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    if (value) {
      updateQtyDelivered(detail.quantity);
    } else {
      updateQtyDelivered(0);
    }

    setChecked(event.target.checked);
  };

  const updateQtyDelivered = (qtyDelivered: number) => {
    const data: UpdateOrderDetailDto = {
      orderId: orderId!,
      id: detail!.id,
      qtyDelivered: qtyDelivered,
    };

    update(data);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: detail.quantity > 1 ? "flex-start" : "center",
          p: 1,
        }}
      >
        <ListItemIcon>
          <Chip
            label={
              <Typography
                variant="h4"
                color={
                  detail.qtyDelivered === detail.quantity
                    ? "GrayText"
                    : "textPrimary"
                }
              >
                {detail.quantity}
              </Typography>
            }
            variant={
              detail.qtyDelivered !== detail.quantity ? "filled" : "outlined"
            }
          />
        </ListItemIcon>

        <ListItemText
          primary={
            <>
              {detail.product.name}
              {detail.productOption && (
                <Chip
                  sx={{ ml: 1 }}
                  label={`${detail.productOption?.name} `}
                  size="small"
                />
              )}
            </>
          }
          primaryTypographyProps={{
            variant: "h4",
            color:
              detail.qtyDelivered === detail.quantity
                ? "GrayText"
                : "textPrimary",
            sx: {
              textDecoration:
                detail.qtyDelivered === detail.quantity
                  ? "line-through"
                  : "none",
            },
          }}
          secondary={
            <>
              <Typography whiteSpace="pre-wrap" variant="body1">
                {detail.description}
              </Typography>
              {detail.quantity !== detail.qtyDelivered &&
                detail.quantity > 1 && (
                  <>
                    <Stack direction="column" alignItems="right" mt={0.5}>
                      <LinearProgressWrapper
                        value={(detail.qtyDelivered * 100) / detail.quantity}
                        color="info"
                        variant="determinate"
                        sx={{
                          width: "100%",
                        }}
                      />
                      <Typography variant="subtitle1" fontSize={12}>
                        {detail.qtyDelivered} / {detail.quantity}
                      </Typography>
                    </Stack>
                  </>
                )}

              <Box display="flex" justifyContent="space-between">
                <Typography>
                  {formatDistance(new Date(detail.createdAt), new Date(), {
    locale: es,
  })
                  }
                  {/* {detail.createtAt} */}
                </Typography>
                <Typography>
                  {formatDistance(new Date(detail.updatedAt), new Date(), {
    locale: es,
  })}
                  {/* {detail.updatedAt} */}
                </Typography>
              </Box>
            </>
          }
        />

        <Stack direction="row" spacing={0.5}>
          <Checkbox
            icon={<CheckCircleOutline />}
            checkedIcon={<CheckCircle />}
            checked={checked}
            onChange={handleChangeChecked}
            inputProps={{ "aria-label": "controlled" }}
            color="success"
          />

          <IconButton onClick={editDetail} size="small">
            <MoreVertOutlined />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
};
