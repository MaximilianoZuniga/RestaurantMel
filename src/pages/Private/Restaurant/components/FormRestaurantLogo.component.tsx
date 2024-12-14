import { FC, useState, useEffect } from "react";

import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  IconButton,
  styled,
  Box,
  Card,
  Typography,
  CardContent,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
// import { useAppDispatch } from "../../../../../../hooks";
// import { setActiveProduct } from "../../../../../../redux";

import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import { PhotoSharp } from "@mui/icons-material";
import { Restaurant } from "../../Common/models/restaurant.model";
import { useUpdateRestaurantLogo } from "../hooks/useRestaurant";
import { useRestaurantStore } from "../../Common/store/restaurantStore";

const AvatarWrapper = styled(Card)(
  ({ theme }) => `
  
    display: inline-block;
    margin-top: -${theme.spacing(0)};
    border: none;
    box-shadow: none;
    .MuiAvatar-root {
      width: ${theme.spacing(22)};
      height: ${theme.spacing(18)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
  
  width: ${theme.spacing(4)};
  height: ${theme.spacing(6)};
  bottom: ${theme.spacing(3)};
  left: ${theme.spacing(1)}; 
    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
  position: relative;
  
`
);

interface Props {
  restaurant: Restaurant;
}

export const FormRestaurantLogo: FC<Props> = ({ restaurant }) => {
  const { register, handleSubmit, watch } = useForm<{ file: FileList }>({});

  const [image, setImage] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();

  const { setRestaurant } = useRestaurantStore((state) => state);

  const { mutateAsync, isLoading } = useUpdateRestaurantLogo();

  const convert2base64 = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result?.toString());
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: { file: FileList }) => {
    if (data.file.length === 0) {
      enqueueSnackbar("Debe seleccionar una imagen", { variant: "error" });
      return;
    }

    convert2base64(data.file[0]);

    mutateAsync({ file: data.file[0], id: restaurant.id }).then((data) => {
      setRestaurant(data);
    });
  };

  useEffect(() => {
    if (watch("file")?.length === 0) return;

    convert2base64(watch("file")[0]);
  }, [watch("file")]);

  return (
    <>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AvatarWrapper>
              {image || restaurant?.logo ? (
                <Avatar
                  variant="rounded"
                  alt={restaurant.name}
                  src={image || restaurant?.logo}
                />
              ) : (
                <label htmlFor="icon-button-file">
                  <Box
                    sx={{
                      //drop file
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 1,
                      color: "text.disabled",
                      textAlign: "center",
                      width: 200,
                      height: 100,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",

                      ":hover": {
                        cursor: "pointer",
                        borderColor: "primary.main",
                        color: "primary.main",
                      },
                    }}
                  >
                    <PhotoSharp />
                    <Typography>Imagen</Typography>
                  </Box>
                </label>
              )}
              <ButtonUploadWrapper>
                <input
                  id="icon-button-file"
                  type="file"
                  accept="image/*"
                  {...register("file")}
                  hidden
                />
                <label htmlFor="icon-button-file">
                  <IconButton component="span" color="primary">
                    <UploadTwoToneIcon />
                  </IconButton>
                </label>
              </ButtonUploadWrapper>
            </AvatarWrapper>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <LoadingButton
                loading={isLoading}
                type="submit"
                variant="outlined"
              >
                Actualizar
              </LoadingButton>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
